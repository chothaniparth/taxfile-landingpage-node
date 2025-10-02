export const generateBookingCode = () => {
    try {
        // Generate three random uppercase letters
        const randomLetters = Array.from({ length: 3 }, () => 
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) // ASCII A-Z (65-90)
        ).join('');

        // Generate three random digits (100-999)
        const randomThreeDigits = Math.floor(Math.random() * 900) + 1000;

        // Combine the values to create a unique key
        return `${randomLetters}${randomThreeDigits}`;
    } catch (error) {
        console.log('generate UKeyId Error:', error);
    }
};

export const generateGiftCardCode = (length = 10) => {
    try {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars[randomIndex];
        }

        return code;
    } catch (error) {
        console.error('generateGiftCardCode Error:', error);
    }
};