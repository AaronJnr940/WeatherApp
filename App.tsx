import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, FlatList, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import ForecastItem from './components/ForecastItem';
import LottieView from 'lottie-react-native';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;
const bgImage = 'https://images.unsplash.com/photo-1593978301851-40c1849d47d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2VhdGhlciUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D';


type MainWeather = {
  main: {
    "temp": number;
    "feels_like": number;
    "temp_min": number;
    "temp_max": number;
    "pressure": number;
    "humidity": number;
    "sea_level": number;
    "grnd_level": number;
  };
};
type Weather = {
  name: string;
  main: MainWeather;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];

};

export type WeatherForecast = {
  main: MainWeather;
  dt: number;

};

const WeatherScreen = () => {
  // fetching data and displaying it in a view
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState('');
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<WeatherForecast[]>();

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForecast();
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Highest,
      });
      console.log('Location: ', location);
      setLocation(location);
    })();
  }, []);

  const fetchWeather = async () => {
    // fetch data
    if (!location) {
      return;
    }

    const results = await fetch(
      `${BASE_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_KEY}&units=metric`
    );

    const data = await results.json();
    console.log(data);
    setWeather(data);
  };
  //weather forecast data

  const fetchForecast = async() =>{
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    if (!location) {
      return;
    }
    const results = await fetch(
      `${BASE_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_KEY}&units=metric`
    );
    const data = await results.json();
    console.log(data);
    setForecast(data.list);

  };

  // handling data loading state (spinner)

  if (!weather) {
    return <ActivityIndicator />;
  }



  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <ImageBackground source={{ uri: bgImage,}} style={styles.container}>
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}/>

        
        <View style= {{ flex: 1, alignItems: 'center', justifyContent: 'center', }}> 
        <LottieView 
        source={ weather.weather[0].main == 'Rain'
         ? require('./assets/lottie/rain.json')
         : require('./assets/lottie/sunny.json')
        } 

        style={{
          width: 200,
          aspectRatio: 1,
        }}
        loop
        autoPlay
       
        />
        <Text style={styles.location}>{weather.name}</Text>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
        <Text style={styles.weatherStat}> {weather.weather[0].main}</Text>
        

        </View>
        


        <FlatList 
        data={forecast}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
        flexGrow: 0,
        height: 150,
        marginBottom: 15, }}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10, }}
        renderItem={({item}) => <ForecastItem forecast={item} /> }
        />

        <StatusBar style="light" />

        {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Aaron Jnr © 2024</Text>
      </View>
      </ImageBackground>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',

  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

  },
  location: {
    fontSize: 30,
    fontWeight: '500',
    color: 'lightgrey',

  },
  weatherStat: {
    fontSize: 18,
    fontWeight: '500',
    color: 'lightgrey',

  },
  temp: {
    fontSize: 150,
    fontWeight: '600',
    color: '#FEFEFE',
  },
  footer: {
    padding: 7,
    paddingBottom: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    fontSize: 13,
    color: 'white',
  },
});

export default WeatherScreen;
