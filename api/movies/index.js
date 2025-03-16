// api/index.js
export default function handler(req, res) {
    res.status(200).json({ message: "Welcome to the Movie API!" });
}