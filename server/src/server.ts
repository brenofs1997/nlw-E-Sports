import express from 'express';

import cors from 'cors';

import {PrismaClient} from '@prisma/client'
import { convertHrsStringToMin } from './utils/convert-hour-string-to-minute';
import { convertMinutesToHoursString } from './utils/convert-minutes-to-hour-string';

const app = express();

app.use(express.json());
app.use(cors(
    
))

const prisma = new PrismaClient({
    log:['query']
});
app.get('/games', async(request, response) => {
    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads:true,
                }
            }
        }
    });

    return response.json(games);
});
app.post('/games/:id/ads', async(request, response) => {
    const gameId:any = request.params.id;
    const body:any = request.body;

    const ad = await prisma.ad.create({
        data:{
            gameId,
            name:body.name,
            yearsPlaying:body.yearsPlaying,
            discord:body.discord,
            weekDays:body.weekDays.join(','),
            hourStart:convertHrsStringToMin(body.hourStart),
            hourEnd:convertHrsStringToMin(body.hourEnd),
            useVoiceChanel:body.useVoiceChanel,
        }
    })
    return response.status(201).json(ad)
});
app.get('/games/:id/ads',async (request, response) => {
    const gameId = request.params.id;
    const ads = await prisma.ad.findMany({
        select:{
            id:true,
            name:true,
            yearsPlaying:true,
            weekDays:true,
            hourStart:true,
            hourEnd:true,
            useVoiceChanel:true,
        },
        where:{
            gameId,
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return response.json(ads.map(ad =>{
        return{
            ...ad,
            weekDays:ad.weekDays.split(','),
            hoursStart:convertMinutesToHoursString(ad.hourStart),
        }
    }))
});
app.get('/ads/:id/discord', async(request, response) => {
    const adId = request.params.id;
    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord:true,
        },
        where:{
            id:adId,
        }
    })

    return response.json(
       { discord:ad.discord}
    )
});



app.listen(3333);
