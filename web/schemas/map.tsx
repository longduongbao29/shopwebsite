export interface Province {
    province_id: string;
    province_name: string;
    province_type: string;
}

export interface District {
    district_id: string;
    district_name: string;
    district_type: string;
    location: string;
    province_id: string;
}

export interface Ward {
    district_id: string;
    ward_id: string;
    ward_name: string;
    ward_type: string
}