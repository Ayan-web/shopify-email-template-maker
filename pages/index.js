import {  Page, Button, Card } from "@shopify/polaris";
import { useRouter } from "next/router"
import { useEffect,useState } from "react";
import * as Realm from "realm-web";


export default function Index()
{
  const [data,setData] = useState([]);
  useEffect(()=>{
    (async function(){
      const app=new Realm.App({id:process.env.NEXT_PUBLIC_REALM_APP_ID})
      const credentials = Realm.Credentials.anonymous();
      await app.logIn(credentials)
      const mongodb = app.currentUser.mongoClient("mongodb-atlas") 
      const emailTemplatesDB = mongodb.db("test").collection("emails")
      const list = await emailTemplatesDB.find()
      if(list) setData(list)
    })()
  },[])

  console.log(data)
  const list=data.map(element=><Card 
    key={element.name} 
    title={element.name || element.savedname}
    sectioned={true}
    actions={[
      {
         content:'Edit' ,
        onAction:()=>{
          router.push({
            pathname:'/[name]',
            query:{name:element.name || element.savedname}
          })
        }
      }
    ]}
  >
  </Card>)
  const router = useRouter()
  return (
    <Page
    title="Mailz"
    subtitle="email template editor"
    >
      <Button onClick={()=>router.push("/create")}>Create</Button>
      <div style={{padding:"20px 20px 20px 0px"}}>
        {list}
      </div>
      <button onClick={async()=>{
      const app=new Realm.App({id:process.env.NEXT_PUBLIC_REALM_APP_ID})
      const credentials = Realm.Credentials.anonymous();
      await app.logIn(credentials)
      const mongodb = app.currentUser.mongoClient("mongodb-atlas") 
      const emailTemplatesDB = mongodb.db("test").collection("emails")
      emailTemplatesDB.deleteMany()
      }}>delete all</button>
    </Page>
  )
}
