import {type Request, type Response} from 'express';
import { ProductService } from '../service/product.service.js';

export const getAllProducts = async (req : Request, res : Response) => {
     try {
        const productsList = await ProductService();
        res.status(200).json({
            success : true , 
            message : "Products fetched successfully",
            data : productsList
        });
     } catch(error) {
        console.error("Error fetching fruits:", error);

        res.status(500).json({
            success : false ,
            message : "Error fetching products",
            error : error
        });
     }
}