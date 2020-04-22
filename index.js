const nodemailer = require('nodemailer');
const mysql = require('mysql');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('С откуда брать Email? (MYSQL ИЛИ .TXT) ', (answer) => {
  var list_vid  = [
	  			'MYSQL',
	  			'TXT'
  	];
  if(list_vid.indexOf(answer)!=-1){
 	 console.log(`ВЫБРАНО: ${answer}`);
 	 	if(answer=='MYSQL'){
 	 		SEND_USE_EMAIL_MYSQL(0);
 	 	}else{
			SEND_USE_EMAIL_TXT();
 	 	}
  }else{
	console.log('Не верный выбор можно только: '+list_vid.join(','));
  }
  	rl.close();
});

var connection = mysql.createPool({
    host     : '31.31.196.162',
    user     : 'u0476824_default',
    password : '6-ZP#g#0S7Nad26v%',
    database : 'u0476824_rabota_tut'
});

connection.query('SET CHARACTER SET utf8'); 

connection.query('select 1 + 1', (err, rows) => { /* */ });


async function GetEmailMysql(id){
	var sel_info = "SELECT `meta_value` FROM `vp_postmeta` WHERE `meta_key` = 'email' LIMIT "+id+",5";
		return new Promise((resolve,reject)=>{
				connection.query(sel_info,(err,result)=>{
						result = JSON.parse(JSON.stringify(result)).filter((el)=>{
							return el.meta_value.match(/.+\@.+?\..+/);
						});
						resolve(result);
				});
		});
}



async function SendEmail(email){
    let testEmailAccount = await nodemailer.createTestAccount();
    var file = fs.readFileSync('message/body.html','utf8');
    let transporter = nodemailer.createTransport({
      host: 'mail.hosting.reg.ru',
      port: 587,
      secure: false,
      auth: {
        user: 'rabotatut@club.rabota-tut.site',
        pass: 'rabotatut123'
      }
    });
    
    email.forEach(async (e)=>{
    	let email = e['meta_value'];
	    	 var result = await transporter.sendMail({
			      from: '"Премиум размещение вакансий" <rabotatut@club.rabota-tut.site>',
			      to: email,
			      subject: "Не 10, не 20 и даже не 50...",
			      html: file
	    });
    });
   
    
    console.log(result);

}


async function SEND_USE_EMAIL_MYSQL(id){
	var id = +id;
	var get_email  = await GetEmailMysql(id);
		if(get_email.length > 0 ){
			console.log("-=-=-НАЧИНАЮ ОТПРАВКУ-=-=-");
				await SendEmail(get_email);
			console.log('-=-=-ОТПРАВЛЕНО-=-=-');
			id+=5;
				setTimeout(SEND_USE_EMAIL_MYSQL,5000,id)
		}else{
			console.log('ОТПРАВКА ЗАКОНЧЕНА!');
		}
}

async function SEND_USE_EMAIL_TXT(){
		var file = fs.readFileSync('email.txt','utf8').toString().split("\n");
		var leng_file = file.length;
		var send_ = 0;
			console.log(`Всего email_ов: ${leng_file} `);
				console.log("-=-=-Начинаю отправку-=-=-");
		var send_email_ = setInterval(()=>{
				if(send_!=leng_file){
					console.log(file[send_]);
						send_++;
				}else
					clearInterval(send_email_);
			},3000);

}
