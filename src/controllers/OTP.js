export default async (req, res) => {
    try{
        const MobileNumber = req.params.MobileNumber.slice(2);

        const otp = Math.random().toString().substr(2, 6);

        const message = `Your%20OTP%20is%20${otp}%20for%20Monarch%20MyEventz%20Application.%20-%20MONARCH`

        const url = process.env.OTP_URL.replace("@Mobile@", MobileNumber).replace("@Message@", message);

        await fetch(url, { method: 'GET' })

        res.status(200).json({ pin: Buffer.from(String(otp)).toString("base64"), message: "OTP sent successfully", Success : true });
    }catch(error){
        res.status(500).json({ error: error.message, Success : false });
    }
}