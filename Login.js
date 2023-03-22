import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Image, Button, TouchableOpacity } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession();

export default function App({navigation}) {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "341607879707-kq8q99llblsvrurbndsspu399urjcg5r.apps.googleusercontent.com",
    iosClientId: "341607879707-7qspd1s06imrouqb3enolhj11gnb1qbn.apps.googleusercontent.com",
    expoClientId: "341607879707-gsaduvcpe998st60efg4auuqhdkpo9ib.apps.googleusercontent.com"
  });

  React.useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}`}
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    });
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{uri: userInfo.picture}} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
          <TouchableOpacity
      style={{backgroundColor: 'white',
      width: "14%",
      borderRadius: 20,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 10,
      }}
      onPress={() => navigation.navigate({ name: "Home" })}
    >

      <Image  style={{
        
            height: 30,
            width: 30,

          }}
          source={{
            uri: 'https://tse3.mm.bing.net/th?id=OIP.2NaVm9dhAV5TzZRs62AXPQHaHa&pid=Api&P=0',
          }}/>

    </TouchableOpacity>

        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      {showUserInfo()}
      <Button 
        title={accessToken ? "Get User Data" : "Login"}
        onPress={accessToken ? getUserData : () => { promptAsync({useProxy: true, showInRecents: true}) }} 
      />
      
      <StatusBar style="auto" />

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50
  }
});