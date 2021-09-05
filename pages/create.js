import { Frame,  Pagination, Button, Modal, TextField } from "@shopify/polaris";
import * as Realm from "realm-web";
import { useRef, useState, useCallback   } from 'react'
import { useRouter } from "next/router"
import EmailEditor from 'react-email-editor'

export default function help()
{
    const router = useRouter()
    const [saveTemplateName,setSaveTemplateName]=useState('')
    const [show,setShow]=useState(false)
    const saveButton = useRef(null)
    const emailEditorRef = useRef(null)
    const handleChange = useCallback((newValue) => setSaveTemplateName(newValue), []);
    const saveProcess=()=>{
                emailEditorRef.current.saveDesign(async (design)=>{
                    const app = Realm.App.getApp(process.env.NEXT_PUBLIC_REALM_APP_ID); 
                    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
                    const emailTemplatesDB = mongodb.db("test").collection("emails")
                    console.log(design)
                    await emailTemplatesDB.insertOne({
                        "savedname":saveTemplateName,
                        "savedtemplate":design
                    })
                })
                setShow(false)
            }
    const navbar=(
        <Pagination
        onPrevious={()=>router.push("/")}
        previousTooltip="Home"
        hasPrevious={true}
        hasNext={false}
        />
    )
    return (
        <div>
        <Modal
        activator={saveButton}
        open={show}
        onClose={()=>{setShow(false)}}
        title="save template"
        primaryAction={{
            content:"save",
            onAction:saveProcess,
        }}
        >
            <Modal.Section>
            <TextField
            label="name template"
            value={saveTemplateName}
            onChange={handleChange}
            >
            </TextField>
            </Modal.Section>
        </Modal>
        <Frame
        topBar={navbar}
        >
            <EmailEditor
            ref={emailEditorRef}
            />
            <Button
            ref={saveButton}
            onClick={()=>{
                if(saveTemplateName.length===0)
                {
                    setShow(true)
                    return
                }
                emailEditorRef.current.saveDesign(async (design)=>{
                const app = Realm.App.getApp(process.env.NEXT_PUBLIC_REALM_APP_ID); 
                const mongodb = app.currentUser.mongoClient("mongodb-atlas");
                const emailTemplatesDB = mongodb.db("test").collection("emails")
                await emailTemplatesDB.updateOne(
                    {savedname:saveTemplateName},
                    {$set:{savedtemplate:design}}
                )
                console.log('not changed just saved')
            })
            }}
            
            >Save</Button>
        </Frame>
    </div>
    )
}