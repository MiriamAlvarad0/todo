import React from 'react';
import {
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#6A4C9C', // Morado
  secondary: '#D1D3D4', // Gris claro
  white: '#fff',
  lightGray: '#f5f5f5',
  darkGray: '#a9a9a9',
  success: '#28a745', // Verde para tareas completadas
  danger: '#dc3545', // Rojo para eliminar tareas
};

const TodoApp = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput.trim() === '') {
      Alert.alert('Error', 'Por favor, ingrese una tarea válida');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput.trim(),
        completed: false,
        dateTime: new Date().toLocaleString(),
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos != null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = (todoId) => {
    const updatedTodos = todos.map((item) => {
      if (item.id === todoId) {
        return { ...item, completed: true };
      }
      return item;
    });

    setTodos(updatedTodos);
  };

  const deleteTodo = (todoId) => {
    const updatedTodos = todos.filter((item) => item.id !== todoId);
    setTodos(updatedTodos);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirma', '¿Quieres borrar todas las tareas?', [
      { text: 'Sí', onPress: () => setTodos([]) },
      { text: 'No' },
    ]);
  };

  const ListItem = ({ todo }) => (
    <TaskCard>
      <View style={{ flex: 1 }}>
        <TaskTitle
          style={{
            textDecorationLine: todo?.completed ? 'line-through' : 'none',
            color: todo?.completed ? COLORS.success : COLORS.primary,
          }}
        >
          {todo?.task}
        </TaskTitle>
        <TaskDateTime>{todo?.dateTime}</TaskDateTime>
      </View>
      {!todo?.completed && (
        <Icon
          name="done"
          size={20}
          color={COLORS.success}
          onPress={() => markTodoComplete(todo.id)}
        />
      )}
      <Icon
        name="delete"
        size={20}
        color={COLORS.danger}
        onPress={() => deleteTodo(todo.id)}
      />
    </TaskCard>
  );

  return (
    <Container>
      <Header>
        <Title>App De Tareas</Title>
        <Icon name="delete-sweep" size={25} color={COLORS.white} onPress={clearAllTodos} />
      </Header>
      <TaskList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <Footer>
        <InputContainer>
          <TextInput
            value={textInput}
            placeholder="Agregar tarea"
            onChangeText={(text) => setTextInput(text)}
            style={{
              height: 50,
              color: COLORS.primary,
              fontSize: 16,
              paddingHorizontal: 10,
            }}
          />
        </InputContainer>
        <IconContainer onPress={addTodo}>
          <Icon name="add" color={COLORS.white} size={30} />
        </IconContainer>
      </Footer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.lightGray};
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.primary};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 24px;
  color: ${COLORS.white};
`;

const TaskList = styled(FlatList)`
  flex: 1;
`;

const TaskCard = styled.View`
  padding: 20px;
  background-color: ${COLORS.white};
  flex-direction: row;
  border-radius: 10px;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${COLORS.secondary};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 5;
`;

const TaskTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
`;

const TaskDateTime = styled.Text`
  font-size: 14px;
  color: ${COLORS.secondary};
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  background-color: ${COLORS.white};
  border-top-width: 1px;
  border-top-color: ${COLORS.secondary};
  border-radius: 10px;
  margin-top: 20px;
`;

const InputContainer = styled.View`
  flex: 1;
  margin-right: 20px;
  border-radius: 30px;
  background-color: ${COLORS.white};
  border-width: 1px;
  border-color: ${COLORS.secondary};
  padding: 0 20px;
`;

const IconContainer = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  background-color: ${COLORS.primary};
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;



export default TodoApp;
