export interface WheelchairModel {
    id: string
    model: string
    stock: number
    max_weight: number
    battery_capacity: number
    price: number
}

export interface WheelchairAgent {
    id: string
    full_name: string
    email: string
    phone: string
    location: string
    open_time: string
    close_time: string
    latitude: string
    longitude: string
}

export interface WheelchairStatus {
    id: string
    status: string
}

export interface WheelchairItem {
    id: string
    model_id: string
    agent_id: string
    name: string
    serial_number: string
    description: string
    last_maintenance_date: string | null
    wheelchairs_status_id: string
    model: WheelchairModel
    agent: WheelchairAgent
    wheelchair_status: WheelchairStatus
}

export interface WheelchairListResponse {
  response: {
    page: {
      total_record_count: number
      batch_number: number
      batch_size: number
      max_batch_size: number
    }
    records: WheelchairItem[]
  }
  metaData?: {
    message: string
    code: number
    response_code: string
  }
}


export interface WheelchairDetailResponse {
    response: {
        page: any; // atau ketik sesuai paginasi kamu
        records: WheelchairItem[];
    }
    metaData?: {
        message: string
        code: number
        response_code: string
    }
}
