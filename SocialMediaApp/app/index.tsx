import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
   <View>
    <Image source={require('./../assets/images/main.jpg')} 
      style={{
        width:'100%',
        height:500
      }}
    />
    <View style={styles.container}>
      <Text style={{
        fontWeight:800,
        fontSize:30,
        textAlign:'center',
        marginTop:20
      }}>Social Media</Text>

      <Text style={{
        fontSize:15,
        textAlign:'center',
        marginTop:20

      }}>Welcome to our social media app! Connect with friends, share updates, explore content, and enjoy a vibrant, engaging online community.</Text>

      <TouchableOpacity style={styles.button} onPress={()=>router.push('auth/signin')}>
        <Text style={{
          fontWeight:800,
          color:'white',
          textAlign:'center',
          fontSize:15
        }}>
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
   </View>
  );
}

const styles = StyleSheet.create({  
  container:{
    backgroundColor:'white',
    marginTop:-20,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    height:'100%',
    padding:25
  },
  button:{
    padding:15,
    backgroundColor:'black',
    borderRadius:99,
    marginHorizontal:15,
    marginTop:'25%'
  }
})