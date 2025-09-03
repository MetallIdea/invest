export type NdField = {
    ID: number;
    Name: string;
    Type: string;
}

export type NdTable = {
    ID: number;
    Name: string;
    Fields: NdField[];
}