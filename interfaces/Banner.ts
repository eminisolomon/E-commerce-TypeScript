export interface IBanner {
    name: string;
    image: {
        public_id: string;
        url: string;
    };
    description: string;
    isActive: boolean;
}
