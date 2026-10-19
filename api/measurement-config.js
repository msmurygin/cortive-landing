module.exports=(req,res)=>{res.setHeader('Cache-Control','no-store');return res.status(200).json({enabled:false,environment:'preview'});};
