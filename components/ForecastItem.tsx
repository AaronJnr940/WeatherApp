import { Text, View, StyleSheet } from 'react-native';
import { WeatherForecast } from '../App';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';

const ForecastItem = ({ forecast} : {forecast: WeatherForecast} ) => {
  return (
    <BlurView intensity={30} style={styles.container}>
        <Text style={styles.temp}>{Math.round(forecast.main.temp)}°</Text>
        <Text style= {styles.date}>{dayjs(forecast.dt * 1000 ).format('ddd h a')}</Text>
    </BlurView>
  );
};

const styles= StyleSheet.create(
    {
        container:{
            padding: 10,
            aspectRatio: 3 / 4,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderColor: 'gainsboro',
            borderWidth: StyleSheet.hairlineWidth,
        },
        temp:{
            fontSize: 35,
            fontWeight: '400',
            color: 'white',
            marginVertical: 10,
        },
        date:{
            fontWeight: 'bold',
            color: 'white',
            fontSize: 16,

        }


    });
export default ForecastItem;
