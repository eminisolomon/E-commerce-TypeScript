import Order from '@models/Order';

export default async function generateReference(): Promise<string> {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference: string = 'BARK-';
    for (let i = 0; i < 12; i++) {
        const randomIndex: number = Math.floor(Math.random() * characters.length);
        reference += characters[randomIndex];
    }

    const existingOrder = await Order.findOne({ paymentReference: reference });
    if (existingOrder) {
        return generateReference();
    }

    return reference;
}
