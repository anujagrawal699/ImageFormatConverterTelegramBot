const  { Telegraf }  = require("telegraf");
var convertapi = require('convertapi')(process.env.convertkey);

require('dotenv').config()

const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
var dir = require('os').tmpdir();

bot.start((ctx) => {ctx.reply("Welcome to the File Format conversion bit.\n Currently we only support jpg to other formats conversion (Sending other formats will cause errors.) \n Send the file you want to convert.");
});
var link = null;
var link1 = null;
bot.on('photo', async (ctx) => {
    link = await bot.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id);
    link1 = link.href;
    ctx.reply('Input received successfully!');
    showFileFormatOptions(ctx);
});

bot.on('document', async (ctx) => {
    fileId = ctx.message.document.file_id;
    ctx.reply('Input received successfully!');
    showFileFormatOptions(ctx);
});

function showFileFormatOptions(ctx) {
    ctx.reply('Select the file format you want to convert to:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "PDF", callback_data: "pdf" },
                    { text: "DOCX", callback_data: "docx" },
                    { text: "JPG", callback_data: "jpg" },
                    { text: "PNG", callback_data: "png"},
                    { text: "WEBP", callback_data: "webp"}
                ]
            ]
        }
    });
}

bot.action("pdf", async (ctx) => {
    await convertAndSend(ctx, link1, 'pdf');
});

bot.action("docx", async (ctx) => {
    await convertAndSend(ctx, 'docx');
});

bot.action("jpg", async (ctx) => {
    await convertAndSend(ctx, 'jpg');
});

bot.action("png", async (ctx) => {
    await convertAndSend(ctx, 'png');
});

bot.action("webp", async (ctx) => {
    await convertAndSend(ctx, 'webp');
});

async function convertAndSend(ctx,url, outputFormat) {
    try {
        var resultPromise = convertapi.convert(outputFormat, { File: link1 }) .then(function(result) {
            console.log(result.Files)
          
            return result.saveFiles(dir);
          })
          .then(function(files) {
            console.log(`The ${outputFormat} saved to\n` + files);
            return ctx.replyWithDocument({ source: files[0] });
          })
          .catch(function(e) {
            console.error(e.toString());
          });
        
       
    } catch (error) {
        console.error(error.toString());
        ctx.reply('An error occurred during conversion. Please try again later.');
    }
}




/* bot.command("menu", (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, "Select the file format you want to convert to: ", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "PDF", callback_data: "pdf" },
                    { text: "DOCX", callback_data: "docx" },
                    { text: "JPG", callback_data: "jpg" },
                    { text: "PNG", callback_data: "png"},
                    {text: "webp", callback_data: "webp"}
                ]
            ]
        }
    });
}); */






bot.startPolling();
