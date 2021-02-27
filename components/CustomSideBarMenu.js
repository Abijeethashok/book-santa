import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permisions from 'expo-Permisions'
import db from '../config'

import firebase from 'firebase';

export default class CustomSideBarMenu extends Component{
  constructor(){
    super()
   this.state = {
     userId : firebase.auth().currrentUser.email,
     image :  null,
     name : "",
     docId : ""

   }
  }
  selectpicture = async ()=>{
    const{cancled,uri}  = await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ImagePicker.MediaTypesOptions.All,allowsEditing : true,aspect : [4,3],quality : 1 
    }) 
    if(!cancled){this.uploadpicture(uri)}
   }

   uploadpicture= (uri)=>{db.collection('users').doc(this.state.docId).update({image:uri})}
   
   getuserdetials(){
     db.collection('users').where('email_id','==',this.state.userId).onSnapshot(query=>{
       query.forEach(doc=>{
         this.setState({
           name : doc.data().first_name,docId : doc.id , image : doc.data().image
         })
       })
     })
   }

   componentDidMount(){
     this.getuserdetials()
   }

  render(){
    return(
      <View style={{flex:1}}>
        

        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Log Out</Text>
          </TouchableOpacity>

          <Avatar rounded icon = {{name : 'user', type : 'font-awesome'}}
        source = {{uri : this.state.image}} size = "medium" containerStyle = {{flex : 0.75 , width : "40%" ,height : "20%",marginLeft : 20 ,marginTop : 30,borderRadius:40 }} onPress = {()=>this.selectpicture()}/>

        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
