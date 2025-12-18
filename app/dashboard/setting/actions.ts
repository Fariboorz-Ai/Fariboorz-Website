"use server";

import { connectDB } from "@/app/db";
import userModel from "@/app/models/userModel";
import StrategyModel from "@/app/models/strategiesModel";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { encrypt, decrypt } from "@/utils/encryption"; 

const settingsSchema = zfd.formData({
  exchangeName: zfd.text(z.string().optional()),
  apiKey: zfd.text(z.string().optional()),
  apiSecret: zfd.text(z.string().optional()),

  strategyId: zfd.text(z.string().optional()),
  leverage: zfd.numeric(z.number().min(1).max(100).optional()).or(zfd.text().optional()).transform((val) => {
    if (typeof val === 'string') return parseInt(val) || 10;
    return val || 10;
  }),
  marginType: zfd.text(z.enum(['cross', 'isolated']).optional()).or(zfd.text().optional()).transform((val) => {
    return val === 'cross' || val === 'isolated' ? val : 'isolated';
  }),
  margin: zfd.numeric(z.number().min(0).optional()).or(zfd.text().optional()).transform((val) => {
    if (typeof val === 'string') return parseFloat(val) || 0;
    return val || 0;
  }),
  tradeLimit: zfd.numeric(z.number().min(0).optional()).or(zfd.text().optional()).transform((val) => {
    if (typeof val === 'string') return parseInt(val) || 5;
    return val || 5;
  }),
  tradingActive: zfd.checkbox(),

  telegramToken: zfd.text(z.string().optional()),
  telegramChatId: zfd.text(z.string().optional()),
  telegramActive: zfd.checkbox(),

  timezone: zfd.text(z.string().optional()).or(zfd.text().optional()).transform((val) => val || 'Asia/Tehran'),
  language: zfd.text(z.enum(['fa', 'en']).optional()).or(zfd.text().optional()).transform((val) => val === 'fa' || val === 'en' ? val : 'fa'),
  notificationsActive: zfd.checkbox(),
});

export async function loadStrategies() {
  try {
    await connectDB();
    let strategies = await StrategyModel.find({}).sort({ createdAt: -1 });
    return {
      success: true,
      data: strategies.map(strategy => ({
        id: strategy._id.toString(),
        name: strategy.name,
        strategy_id: strategy.strategy_id,
      }))
    };
  } catch (error) {
    console.error("Error loading strategies:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load strategies"
    };
  }
}

export async function loadUserSettings() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("User not authenticated");

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const strategiesResult = await loadStrategies();
    const strategies = strategiesResult.success ? strategiesResult.data : [];

    return {
      success: true,
      data: {
        exchangeName: user.exchange?.name || '',
        apiKey: user.exchange?.apiKey ? decrypt(user.exchange.apiKey) : '',       
        apiSecret: user.exchange?.apiSecret ? decrypt(user.exchange.apiSecret) : '', 

        strategyId: user.trade_settings?.strategyId?.toString() || '',
        leverage: user.trade_settings?.leverage || 10,
        marginType: user.trade_settings?.marginType || 'isolated',
        margin: user.trade_settings?.margin || 0,
        tradeLimit: user.trade_settings?.tradeLimit || 5,
        tradingActive: user.trade_settings?.isActive ?? true,

        telegramToken: user.telegram?.token ? decrypt(user.telegram.token) : '',   
        telegramChatId: user.telegram?.chatId || '',
        telegramActive: user.telegram?.isActive ?? false,

        timezone: user.settings?.timezone || 'Asia/Tehran',
        language: user.settings?.language || 'fa',
        notificationsActive: user.notifications?.isActive ?? true,

        strategies,
      }
    };
  } catch (error) {
    console.error("Error loading user settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load settings"
    };
  }
}

export async function saveUserSettings(formData: FormData) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { message: "User not authenticated", success: false };

    const validated = settingsSchema.safeParse(formData);
    if (!validated.success) return { message: "Invalid form data", success: false };

    const data = validated.data;

    const encryptedApiKey = data.apiKey ? encrypt(data.apiKey.trim()) : undefined;
    const encryptedApiSecret = data.apiSecret ? encrypt(data.apiSecret.trim()) : undefined;
    const encryptedTelegramToken = data.telegramToken ? encrypt(data.telegramToken.trim()) : undefined;

  
    let margin_type = 'CROSS';
    if (data.exchangeName === 'bitunix') {
      margin_type = data.marginType === 'isolated' ? 'ISOLATION' : 'CROSS';
    } else if (data.exchangeName === 'bingx') {
      margin_type = data.marginType === 'isolated' ? 'ISOLATED' : 'CROSSED';
    }

    const updateData: any = {
      trade_settings: {
        strategyId: data.strategyId || null,
        leverage: data.leverage,
        margin_type,
        margin: data.margin,
        tradeLimit: data.tradeLimit,
        isActive: data.tradingActive,
      },
      settings: {
        timezone: data.timezone,
        language: data.language,
      },
      'notifications.isActive': data.notificationsActive,
    };

 
    if (data.exchangeName) {
      updateData.exchange = {
        name: data.exchangeName as 'bitunix' | 'bingx',
        apiKey: encryptedApiKey ?? '',   
        apiSecret: encryptedApiSecret ?? '',
        isActive: true,
      };
    } else {
      updateData.exchange = null;
    }


    if (encryptedTelegramToken !== undefined || data.telegramChatId) {
      updateData.telegram = {
        token: encryptedTelegramToken ?? '',
        chatId: data.telegramChatId || '',
        isActive: data.telegramActive,
      };
    } else {
      updateData.telegram = null;
    }

    const user = await userModel.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) return { message: "User not found", success: false };

    revalidatePath('/dashboard/setting');
    return { message: "Settings saved successfully", success: true };
  } catch (error) {
    console.error("Error saving user settings:", error);
    return { message: error instanceof Error ? error.message : "Failed to save settings", success: false };
  }
}