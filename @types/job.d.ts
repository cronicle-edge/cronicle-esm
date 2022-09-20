

declare class CronicleJob {    
    id: string
    title: string
    category: string
    category_title: string
    plugin: string
    host: string
    elapsed: number
    timezone: keyof typeof Timezone
    time_start: number
    time_end: number
    timout: number
    color: "red" | "blue"
    isWorkflow: boolean | null
}


