export type FieldType = "number" | "text" | "file" | "textarea" | "email" | "url" | "location";

export interface Field {
    key: string;
    label: string;
    type: FieldType;
}

export interface Section {
    title: string;
    fields: Field[];
} 