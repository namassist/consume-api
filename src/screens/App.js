import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  Alert,
} from 'react-native';

const Item = ({mhs, index, length, handleDelete, handleEdit}) => {
  return (
    <View style={index === length ? styles.lastCard : styles.card}>
      <TouchableOpacity onPress={handleEdit}>
        <Image
          style={styles.avatar}
          source={require('../assets/avataaars.png')}
        />
      </TouchableOpacity>
      <View style={styles.desc}>
        <Text style={styles.descTitle}>
          {mhs.nim} || {mhs.nama}
        </Text>
        <Text style={styles.descBody}>{mhs.email}</Text>
        <Text style={styles.descBody}>{mhs.telepon}</Text>
        <Text style={styles.descBody}>
          semester:{mhs.semester} angkatan:{mhs.angkatan} IPK:
          {mhs.ipk}
        </Text>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <Text style={index === length ? styles.deleteLast : styles.delete}>
          X
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [semester, setSemester] = useState('');
  const [ipk, setIpk] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [mahasiswa, setMahasiswa] = useState([]);
  const [button, setButton] = useState('simpan data');
  const [currentMhs, setCurrentMhs] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = () => {
    const data = {
      nim,
      nama,
      angkatan,
      semester,
      ipk,
      email,
      telepon,
    };
    if (button === 'simpan data') {
      axios.post('http://10.0.2.2:8080/api/mahasiswa/', data).then(res => {
        setNim('');
        setNama('');
        setAngkatan('');
        setSemester('');
        setIpk('');
        setEmail('');
        setTelepon('');
        getData();
      });
    } else {
      axios
        .put(`http://10.0.2.2:8080/api/mahasiswa/${currentMhs.id}`, data)
        .then(res => {
          setNim('');
          setNama('');
          setAngkatan('');
          setSemester('');
          setIpk('');
          setEmail('');
          setTelepon('');
          getData();
          setButton('simpan data');
        });
    }
  };

  const getData = () => {
    axios.get('http://10.0.2.2:8080/api/mahasiswa/').then(res => {
      setMahasiswa(res.data.data);
    });
  };

  const selectedItem = item => {
    setCurrentMhs(item);
    setNim(item.nim);
    setNama(item.nama);
    setAngkatan(item.angkatan);
    setSemester(item.semester);
    setIpk(item.ipk);
    setEmail(item.email);
    setTelepon(item.telepon);
    setButton('update data');
  };

  const onDelete = item => {
    axios.delete(`http://10.0.2.2:8080/api/mahasiswa/${item.id}`).then(res => {
      getData();
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Daptar Mahasiswa Cool</Text>
      <View>
        <TextInput
          placeholder={'nim'}
          style={styles.input}
          value={nim}
          onChangeText={value => setNim(value)}
        />
        <TextInput
          placeholder={'nama'}
          style={styles.input}
          value={nama}
          onChangeText={value => setNama(value)}
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={'angkatan'}
            style={styles.inputs}
            value={angkatan}
            onChangeText={value => setAngkatan(value)}
          />
          <TextInput
            placeholder={'semester'}
            style={styles.inputs}
            value={semester}
            onChangeText={value => setSemester(value)}
          />
          <TextInput
            placeholder={'IPK'}
            style={styles.inputs}
            value={ipk}
            onChangeText={value => setIpk(value)}
          />
        </View>
        <TextInput
          placeholder={'email'}
          style={styles.input}
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          placeholder={'telepon'}
          style={styles.input}
          value={telepon}
          onChangeText={value => setTelepon(value)}
        />
        <Button title={button} color="royalblue" onPress={handleSubmit} />
        <View style={styles.garis}></View>
      </View>
      {mahasiswa.map((mhs, index) => {
        return (
          <Item
            key={mhs.id}
            mhs={mhs}
            index={index}
            length={mahasiswa.length - 1}
            handleEdit={() => selectedItem(mhs)}
            handleDelete={() =>
              Alert.alert(
                'Peringatan',
                'Anda yakin ingin menghapus data ini?',
                [
                  {
                    text: 'tidak',
                    onPress: () => console.log('cancel'),
                  },
                  {
                    text: 'ya',
                    onPress: () => onDelete(mhs),
                  },
                ],
              )
            }
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orchid',
    height: 100,
    paddingVertical: 20,
    paddingHorizontal: 15,
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
  },
  inputs: {
    height: 40,
    width: 110,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
  },
  garis: {
    borderWidth: 1.5,
    borderColor: 'crimson',
    marginVertical: 15,
  },
  title: {
    marginBottom: 20,
    color: 'seashell',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  lastCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 50,
  },
  avatar: {
    height: 80,
    width: 80,
  },
  desc: {
    flex: 1,
    marginLeft: 10,
  },
  descTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  descBody: {
    fontSize: 12,
  },
  delete: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginTop: -40,
  },
  deleteLast: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginTop: -40,
  },
});

export default App;
