export interface PackageItem {
    id: string
    name: string
    picture: string
    description: string
    price: string // dari BE string, tapi bisa di-convert number untuk display
}

export interface PackageListResponse {
    response: PackageItem[]
    metaData?: {
        message: string
        code: number
        response_code: string
    }
}

export interface PackageDetailResponse {
    response: PackageItem
    metaData?: {
        message: string
        code: number
        response_code: string
    }
}
