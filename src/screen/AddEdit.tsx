import React, {useEffect, useState} from 'react';
import {Text, View, Button, Alert} from 'react-native';
import {IBook} from '../api/types';
import TextField from '../components/TextField';
import {fetcher} from '../utils/fetcher';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useSWRConfig} from 'swr';

export default function AddEdit({
  route,
  navigation,
}: {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}) {
  const params = route.params;

  const isEdit = params?.isEdit;
  const bookDataParam = params?.bookData;

  const initialBookData = isEdit
    ? bookDataParam
    : {
        id: 0,
        kode_buku: '',
        judul_buku: '',
        tahun_terbit: new Date().getFullYear(),
        nama_penerbit: '',
        nama_pengarang: '',
      };

  const [bookData, setBookData] = useState<IBook>(initialBookData);

  const handleInputChange = (key: keyof IBook, value: string | number) => {
    setBookData({
      ...bookData,
      [key]: value,
    });
  };

  useEffect(() => {
    if (isEdit) {
      navigation.setOptions({
        title: 'Edit',
      });
    }
  }, [isEdit, navigation]);

  const {mutate} = useSWRConfig();

  const handleSave = () => {
    try {
      if (isEdit) {
        fetcher
          .put(`books/${bookData.id}`, {
            json: {
              kode_buku: bookData.kode_buku,
              judul_buku: bookData.judul_buku,
              tahun_terbit: Number(bookData.tahun_terbit),
              nama_penerbit: bookData.nama_penerbit,
              nama_pengarang: bookData.nama_pengarang,
            },
          })
          .then(() => {
            mutate('books').then(() => {
              navigation.goBack();
            });
          });
        return;
      }
      fetcher
        .post('books', {
          json: {
            kode_buku: bookData.kode_buku,
            judul_buku: bookData.judul_buku,
            tahun_terbit: Number(bookData.tahun_terbit),
            nama_penerbit: bookData.nama_penerbit,
            nama_pengarang: bookData.nama_pengarang,
          },
        })
        .then(() => {
          mutate('books').then(() => {
            navigation.goBack();
          });
        });
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
    }
  };

  const handleDelete = () => {
    if (isEdit) {
      fetcher.delete(`books/${bookData.id}`).then(() => {
        mutate('books').then(() => {
          navigation.goBack();
        });
      });
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        gap: 16,
        paddingTop: 20,
        backgroundColor: 'white',
      }}>
      <View>
        <Text>Kode Buku:</Text>
        <TextField
          value={bookData.kode_buku}
          onChangeText={text => handleInputChange('kode_buku', text)}
        />
      </View>

      <View>
        <Text>Judul Buku:</Text>
        <TextField
          value={bookData.judul_buku}
          onChangeText={text => handleInputChange('judul_buku', text)}
        />
      </View>

      <View>
        <Text>Tahun Terbit:</Text>
        <TextField
          value={bookData.tahun_terbit.toString()}
          keyboardType="numeric"
          onChangeText={text =>
            handleInputChange('tahun_terbit', parseInt(text))
          }
        />
      </View>

      <View>
        <Text>Nama Penerbit:</Text>
        <TextField
          value={bookData.nama_penerbit}
          onChangeText={text => handleInputChange('nama_penerbit', text)}
        />
      </View>

      <View>
        <Text>Nama Pengarang:</Text>
        <TextField
          value={bookData.nama_pengarang}
          onChangeText={text => handleInputChange('nama_pengarang', text)}
        />
      </View>

      <View
        style={{
          marginTop: 20,
        }}>
        <Button title="Simpan" onPress={handleSave} />
        {isEdit && (
          <View
            style={{
              marginTop: 12,
            }}>
            <Button color={'#d11a2a'} title="Hapus" onPress={handleDelete} />
          </View>
        )}
      </View>
    </View>
  );
}
