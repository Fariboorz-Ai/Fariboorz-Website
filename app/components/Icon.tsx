"use client"
import React from 'react'
import { Icon as Iconify } from "@iconify-icon/react";
const Icon = (props: {className ?: string , icon : string}) => {
    return (
        <Iconify {...props} />
    )
}

export default Icon
