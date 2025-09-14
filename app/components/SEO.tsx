"use client";
import Head from "next/head";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  titleTemplate?: string;
  description?: string;
  keywords?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  canonical?: string;
  type?: "website" | "article" | "product" | "profile";
  locale?: string;
  alternateLocales?: string[];  
  hreflangs?: { hrefLang: string; href: string }[];
  author?: string;
  publisher?: string;
  twitterSite?: string; 
  twitterCreator?: string; 
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  nofollow?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  siteName?: string;
  organization?: {
    name?: string;
    logo?: string;
    sameAs?: string[];
  };
  searchUrl?: string;
  additionalJsonLd?: Record<string, any>[]; 
}

export default function SEO({
  title = "Fariboorz - Advanced Trading Platform",
  titleTemplate = "%s | Fariboorz",
  description = "Experience the future of trading with advanced AI algorithms and real-time execution. Join thousands of traders who have transformed their trading with Fariboorz.",
  keywords = "trading, AI, algorithmic trading, cryptocurrency, forex, stocks, automated trading, trading bot, portfolio analytics",
  image = "/images/og-image.jpg",
  imageWidth = 1200,
  imageHeight = 630,
  url = "https://yourdomain.com",
  canonical,
  type = "website",
  locale = "en_US",
  alternateLocales = ["fa_IR"],
  hreflangs,
  author = "Fariboorz Team",
  publisher = "Fariboorz",
  twitterSite = "@fariboorz",
  twitterCreator = "@fariboorz",
  publishedTime,
  modifiedTime,
  noindex = false,
  nofollow = false,
  breadcrumbs,
  siteName = "Fariboorz",
  organization = {
    name: "Fariboorz",
    logo: "/favicon-32x32.png",
    sameAs: [
      "https://twitter.com/fariboorz",
      "https://linkedin.com/company/fariboorz",
      "https://github.com/fariboorz"
    ]
  },
  searchUrl = "https://yourdomain.com/search?q={search_term_string}",
  additionalJsonLd = []
}: SEOProps) {
  const computedCanonical = canonical || url;
  const computedTitle = titleTemplate.replace("%s", title);

  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
    "max-snippet:-1",
    "max-image-preview:large",
    "max-video-preview:-1"
  ].join(", ");

  const ogImageUrl = image.startsWith("http")
    ? image
    : `${url.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}`;

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: searchUrl,
      "query-input": "required name=search_term_string"
    }
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization?.name || siteName,
    url,
    logo: organization?.logo?.startsWith("http")
      ? organization.logo
      : `${url.replace(/\/$/, "")}${organization?.logo || ""}`,
    sameAs: organization?.sameAs || []
  };

  const jsonLdBreadcrumbs =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        }
      : null;

  const jsonLdArticle =
    type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          mainEntityOfPage: computedCanonical,
          headline: title,
          description,
          image: [ogImageUrl],
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          author: [{ "@type": "Person", name: author }],
          publisher: {
            "@type": "Organization",
            name: publisher,
            logo: {
              "@type": "ImageObject",
              url: jsonLdOrg.logo
            }
          }
        }
      : null;

 
  const jsonLdBlocks: object[] = [
    jsonLdWebsite,
    jsonLdOrg,
    ...(jsonLdBreadcrumbs ? [jsonLdBreadcrumbs] : []),
    ...(jsonLdArticle ? [jsonLdArticle] : []),
    ...additionalJsonLd
  ];

  return (
    <Head>
      <title key="title">{computedTitle}</title>

      <meta key="charset" charSet="utf-8" />
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta key="theme-color" name="theme-color" content="#dc2626" />
      <meta key="ms-tile" name="msapplication-TileColor" content="#dc2626" />
      <meta key="author" name="author" content={author} />
      <meta key="description" name="description" content={description} />
      {keywords && <meta key="keywords" name="keywords" content={keywords} />}
      <meta key="robots" name="robots" content={robotsContent} />
      <meta key="googlebot" name="googlebot" content={robotsContent} />

      <link key="canonical" rel="canonical" href={computedCanonical} />

      {hreflangs?.map((alternate) => (
        <link
          key={`alt-${alternate.hrefLang}`}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={alternate.href}
        />
      ))}

      <meta key="og:locale" property="og:locale" content={locale} />
      {alternateLocales?.map((loc) => (
        <meta
          key={`og:locale:alt-${loc}`}
          property="og:locale:alternate"
          content={loc}
        />
      ))}
      <meta key="og:site_name" property="og:site_name" content={siteName} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:title" property="og:title" content={computedTitle} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:url" property="og:url" content={computedCanonical} />
      <meta key="og:image" property="og:image" content={ogImageUrl} />
      <meta
        key="og:image:width"
        property="og:image:width"
        content={String(imageWidth)}
      />
      <meta
        key="og:image:height"
        property="og:image:height"
        content={String(imageHeight)}
      />
      {modifiedTime && (
        <meta
          key="og:updated_time"
          property="og:updated_time"
          content={modifiedTime}
        />
      )}

      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:site" name="twitter:site" content={twitterSite} />
      <meta key="twitter:creator" name="twitter:creator" content={twitterCreator} />
      <meta key="twitter:title" name="twitter:title" content={computedTitle} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta key="twitter:image" name="twitter:image" content={ogImageUrl} />

      {type === "article" && (
        <>
          {publishedTime && (
            <meta
              key="article:published_time"
              property="article:published_time"
              content={publishedTime}
            />
          )}
          {modifiedTime && (
            <meta
              key="article:modified_time"
              property="article:modified_time"
              content={modifiedTime}
            />
          )}
          <meta key="article:author" property="article:author" content={author} />
        </>
      )}

      <meta
        key="apple-mobile-web-app-capable"
        name="apple-mobile-web-app-capable"
        content="yes"
      />
      <meta
        key="apple-mobile-web-app-status-bar-style"
        name="apple-mobile-web-app-status-bar-style"
        content="default"
      />
      <meta
        key="apple-mobile-web-app-title"
        name="apple-mobile-web-app-title"
        content={siteName}
      />
      <link key="icon-ico" rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        key="icon-apple"
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        key="icon-32"
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        key="icon-16"
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link key="manifest" rel="manifest" href="/site.webmanifest" />

      <link
        key="preconnect-gfonts"
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        key="preconnect-gstatic"
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {jsonLdBlocks.map((block, idx) => (
        <script
          key={`ld-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </Head>
  );
}
