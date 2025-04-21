

const MAP_URL = "https://vapi.vnappmob.com/api/v2"
import { Province, District, Ward } from "@/schemas/map"

export async function fetchProvinces() {
    try {
        const response = await fetch(`${MAP_URL}/province/`);
        const data: { results: Province[] } = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching provinces:", error);
        return [];
    }
}
export async function fetchDistricts(provinceId: string): Promise<District[]> {
    try {
        const response = await fetch(
            `${MAP_URL}/province/district/${provinceId}`
        );
        const data: { results: District[] } = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching districts:", error);
        return [];
    }
}

export async function fetchWards(districtId: string): Promise<Ward[]> {
    try {
        const response = await fetch(
            `${MAP_URL}/province/ward/${districtId}`
        );
        const data: { results: Ward[] } = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching wards:", error);
        return [];
    }
}
import { UserRegister } from "@/schemas/user"
export async function registerUser(params: UserRegister) {
    return params
}

