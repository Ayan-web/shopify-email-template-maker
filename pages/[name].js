import { useRouter } from 'next/router'
import { Frame,  Pagination, Button, Page } from "@shopify/polaris";
import EmailEditor from 'react-email-editor'
import * as Realm from "realm-web";
import React ,{ useEffect, useRef, useState } from 'react'



export default function Edits()
{
    // console.log(data.savedtemplate)
    const router = useRouter()
    const {name} = router.query
    const emailSaveRef = useRef(null)
    // const [design,setDesign] = useState()
    
    const navbar=(
            <Pagination
            onPrevious={()=>router.push("/")}
            previousTooltip="Home"
            hasPrevious={true}
            hasNext={false}
            />
        )

    async function onLoad(){
        console.log('emailref',emailSaveRef)
        // console.log("design",design)
        const app=new Realm.App({id:process.env.NEXT_PUBLIC_REALM_APP_ID})
        const credentials = Realm.Credentials.anonymous();
        await app.logIn(credentials)
        const mongodb = app.currentUser.mongoClient("mongodb-atlas") 
        const emailTemplatesDB = mongodb.db("test").collection("emails")
    //   console.log(name)
        const data = await emailTemplatesDB.findOne({"savedname":name})
        emailSaveRef.current.loadDesign(data.savedtemplate)
    }
    return(
    <Frame
        topBar={navbar}
        >
            <Page
            title={name}
            ></Page>
            <EmailEditor
            ref={emailSaveRef}
            onLoad={onLoad}
            />
            <Button
            onClick={()=>{
                emailSaveRef.current.saveDesign(async (design)=>{
                const app = Realm.App.getApp(process.env.NEXT_PUBLIC_REALM_APP_ID); 
                const mongodb = app.currentUser.mongoClient("mongodb-atlas");
                const emailTemplatesDB = mongodb.db("test").collection("emails")
                await emailTemplatesDB.updateOne(
                    {savedname:name},
                    {$set:{savedtemplate:design}}
                )
            })
            console.log('saved sucessfuly')
            }}
            
            >Save</Button>
        </Frame>

    )
}