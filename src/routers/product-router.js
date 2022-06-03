import express from 'express';
const productRouter = express.Router();


import {productModel} from '../db/models/product-model.js';

// 상품 전체 보기 (카테고리별)
productRouter.get('/list', async(req,res,next)=>{
    try{
        //product/list/?category=Man%20Clothes
        const {category} = req.query;
        // 상품 카테고리를 기준으로 전부 검색
        const products = await productModel.find({category});
        // 상품들 정보를 프론트에 전달
        res.status(200).json(products);
        console.log('hi');
    }catch(err){
        next(err);
    }
});

// 상품 상세 보기
productRouter.get('/detail', async(req,res,next)=>{
    try{
        // product/detail/?name=브라운%20상의
        const {name} = req.query;
        // 이름으로 상품 하나 찾기
        const product = await productModel.find({name});

        // 상품 데이터 프론트에 전달
        res.status(200).json(product);
        console.log('asdf');
    }catch(err){
        next(err);
    }
});

// 상품 추가
productRouter.post('/add', async(req,res,next)=>{
    try{
        const {name, category, inform, price, storage, date} = req.body;

        //////////////////// 입력값 빠졌는지 검사 //////////////////////////
        if(name == ""){
            throw new Error('상품 이름을 입력해주세요!');
        }
        if(category == ""){
            throw new Error('상품 카테고리를 입력해주세요!');
        }
        if(inform == ""){
            throw new Error('상품 설명을 입력해주세요!');
        }
        if(price == ""){
            throw new Error('상품 가격을 입력해주세요!');
        }
        if(storage == ""){
            throw new Error('상품 재고를 입력해주세요!');
        }
        if(date == ""){
            throw new Error('상품 출시 날짜를 입력해주세요!');
        }
        ////////////////////////////////////////////////////////////////////

        // 데이터베이스에서 같은 이름의 상품이 있는지 검사
        if(await productModel.findOne({name})){
            throw new Error('이미 있는 상품입니다.')
        }

        // 새로운 상품 모델 생성
        const newProduct = await productModel.create({name, category, inform, price, storage, date});
        
        // 상품 모델이 생성되었음을 알리고 데이터를 프론트에 전달
        res.status(201).json(newProduct);
        console.log('상품 추가 완료');
    }catch(err){
        next(err);
    }
})

// 상품 삭제
productRouter.delete('/detail', async(req,res,next)=>{
    try{
        // /detail/?name=브라운%20상의
        const {name} = req.query;
        // 해당 상품 name을 가진 상품 데이터를 삭제
        const deleteProduct = await productModel.deleteOne({name});
        
        res.status(200).json(deleteProduct); 
        console.log('상품이 삭제되었습니다');
    }catch(err){
        next(err);
    }
    
})

// 상품 정보 수정
productRouter.post('/update_product', async(req,res,next)=>{
    try{
        // /update_product/?name=브라운%20상의
        const {name} = req.query;
        // 제품명과 출시날짜는 고정, category, inform, price, storage, date 수정하기 위해 값을 받아오기
        const {category, inform, price, storage} = req.body;

        // 입력값 빠졌는지 검사
        if(category == ""){
            throw new Error('상품 카테고리를 입력해주세요!');
        }
        if(inform == ""){
            throw new Error('상품 설명을 입력해주세요!');
        }
        if(price == ""){
            throw new Error('상품 가격을 입력해주세요!');
        }
        if(storage == ""){
            throw new Error('상품 재고를 입력해주세요!');
        }

        // 제품명으로 상품을 찾고 그 제품의 category, inform, price, storage, date을 수정
        const updateProduct = await productModel.findOneAndUpdate({name}, {category, inform, price, storage}, {returnOriginal : false});
        
        res.status(200).json(updateProduct);
        console.log('상품 정보 수정이 완료되었습니다');
    }catch(err){
        next(err);
    }
})

export {productRouter};