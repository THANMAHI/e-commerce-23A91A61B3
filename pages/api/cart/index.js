import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "../../../lib/prisma"
import { z } from "zod"

const addToCartSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
})

const removeFromCartSchema = z.object({
    productId: z.string(),
})

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    const userId = session.user.id

    // Ensure cart exists
    let cart = await prisma.cart.findUnique({
        where: { userId },
    })

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
        })
    }

    if (req.method === 'GET') {
        const items = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: true },
        })
        return res.status(200).json(items)
    }

    if (req.method === 'POST') {
        const result = addToCartSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error })
        }

        const { productId, quantity } = result.data

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        })

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            })
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            })
        }

        // Return updated cart items
        const updatedItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: true },
        })
        return res.status(200).json(updatedItems)
    }

    if (req.method === 'DELETE') {
        const result = removeFromCartSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error })
        }

        const { productId } = result.data

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        })

        if (existingItem) {
            await prisma.cartItem.delete({
                where: { id: existingItem.id },
            })
        }

        // Return updated cart items
        const updatedItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: true },
        })
        return res.status(200).json(updatedItems)
    }

    if (req.method === 'PUT') {
        const result = addToCartSchema.safeParse(req.body) // Reusing same schema as simple quantity update
        if (!result.success) {
            return res.status(400).json({ error: result.error })
        }

        const { productId, quantity } = result.data

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        })

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity },
            })
        }

        const updatedItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: true },
        })
        return res.status(200).json(updatedItems)
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
