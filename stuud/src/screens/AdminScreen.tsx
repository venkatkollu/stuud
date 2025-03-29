import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addFaculty, addClassroom, addEvent, addTimetable } from '../services/supabase';
import { Faculty, Classroom, Event, Timetable } from '../types';

type FormType = 'faculty' | 'classroom' | 'event' | 'timetable';

const AdminScreen = () => {
  const [activeForm, setActiveForm] = useState<FormType>('faculty');
  const [loading, setLoading] = useState(false);

  // Faculty form state
  const [facultyName, setFacultyName] = useState('');
  const [facultySubjects, setFacultySubjects] = useState('');
  const [facultyCabin, setFacultyCabin] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');

  // Classroom form state
  const [classroomName, setClassroomName] = useState('');
  const [classroomBuilding, setClassroomBuilding] = useState('');
  const [classroomFloor, setClassroomFloor] = useState('');
  const [classroomLatitude, setClassroomLatitude] = useState('');
  const [classroomLongitude, setClassroomLongitude] = useState('');

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Timetable form state
  const [timetableDay, setTimetableDay] = useState('');
  const [timetableStartTime, setTimetableStartTime] = useState('');
  const [timetableEndTime, setTimetableEndTime] = useState('');
  const [timetableSubject, setTimetableSubject] = useState('');
  const [timetableFaculty, setTimetableFaculty] = useState('');
  const [timetableClassroom, setTimetableClassroom] = useState('');

  const resetFacultyForm = () => {
    setFacultyName('');
    setFacultySubjects('');
    setFacultyCabin('');
    setFacultyEmail('');
    setFacultyPhone('');
  };

  const resetClassroomForm = () => {
    setClassroomName('');
    setClassroomBuilding('');
    setClassroomFloor('');
    setClassroomLatitude('');
    setClassroomLongitude('');
  };

  const resetEventForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventStartDate('');
    setEventEndDate('');
    setEventLocation('');
  };

  const resetTimetableForm = () => {
    setTimetableDay('');
    setTimetableStartTime('');
    setTimetableEndTime('');
    setTimetableSubject('');
    setTimetableFaculty('');
    setTimetableClassroom('');
  };

  const handleSubmitFaculty = async () => {
    if (!facultyName || !facultySubjects || !facultyCabin) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newFaculty: Omit<Faculty, 'id'> = {
        name: facultyName,
        subjects: facultySubjects.split(',').map(s => s.trim()),
        cabin: facultyCabin,
        email: facultyEmail || undefined,
        phone: facultyPhone || undefined,
      };

      const result = await addFaculty(newFaculty);
      
      if (result) {
        Alert.alert('Success', 'Faculty added successfully');
        resetFacultyForm();
      } else {
        Alert.alert('Error', 'Failed to add faculty');
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      Alert.alert('Error', 'An error occurred while adding faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClassroom = async () => {
    if (!classroomName || !classroomLatitude || !classroomLongitude) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const latitude = parseFloat(classroomLatitude);
    const longitude = parseFloat(classroomLongitude);
    const floor = classroomFloor ? parseInt(classroomFloor) : undefined;

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert('Error', 'Latitude and longitude must be valid numbers');
      return;
    }

    setLoading(true);
    try {
      const newClassroom: Omit<Classroom, 'id'> = {
        name: classroomName,
        location: {
          latitude,
          longitude,
        },
        building: classroomBuilding || undefined,
        floor: floor,
      };

      const result = await addClassroom(newClassroom);
      
      if (result) {
        Alert.alert('Success', 'Classroom added successfully');
        resetClassroomForm();
      } else {
        Alert.alert('Error', 'Failed to add classroom');
      }
    } catch (error) {
      console.error('Error adding classroom:', error);
      Alert.alert('Error', 'An error occurred while adding classroom');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvent = async () => {
    if (!eventTitle || !eventDescription || !eventStartDate || !eventEndDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newEvent: Omit<Event, 'id'> = {
        title: eventTitle,
        description: eventDescription,
        startDate: eventStartDate,
        endDate: eventEndDate,
        location: eventLocation || undefined,
      };

      const result = await addEvent(newEvent);
      
      if (result) {
        Alert.alert('Success', 'Event added successfully');
        resetEventForm();
      } else {
        Alert.alert('Error', 'Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'An error occurred while adding event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTimetable = async () => {
    if (!timetableDay || !timetableStartTime || !timetableEndTime || !timetableSubject || !timetableFaculty || !timetableClassroom) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newTimetable: Omit<Timetable, 'id'> = {
        day: timetableDay,
        startTime: timetableStartTime,
        endTime: timetableEndTime,
        subject: timetableSubject,
        faculty: timetableFaculty,
        classroom: timetableClassroom,
      };

      const result = await addTimetable(newTimetable);
      
      if (result) {
        Alert.alert('Success', 'Timetable entry added successfully');
        resetTimetableForm();
      } else {
        Alert.alert('Error', 'Failed to add timetable entry');
      }
    } catch (error) {
      console.error('Error adding timetable entry:', error);
      Alert.alert('Error', 'An error occurred while adding timetable entry');
    } finally {
      setLoading(false);
    }
  };

  const renderFacultyForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Add Faculty</Text>
      
      <Text style={styles.inputLabel}>Name *</Text>
      <TextInput
        style={styles.input}
        value={facultyName}
        onChangeText={setFacultyName}
        placeholder="Enter faculty name"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Subjects (comma separated) *</Text>
      <TextInput
        style={styles.input}
        value={facultySubjects}
        onChangeText={setFacultySubjects}
        placeholder="e.g. Computer Science, AI, Machine Learning"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Cabin/Room *</Text>
      <TextInput
        style={styles.input}
        value={facultyCabin}
        onChangeText={setFacultyCabin}
        placeholder="Enter cabin or room number"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Email (optional)</Text>
      <TextInput
        style={styles.input}
        value={facultyEmail}
        onChangeText={setFacultyEmail}
        placeholder="Enter email address"
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      
      <Text style={styles.inputLabel}>Phone (optional)</Text>
      <TextInput
        style={styles.input}
        value={facultyPhone}
        onChangeText={setFacultyPhone}
        placeholder="Enter phone number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitFaculty}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Add Faculty</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderClassroomForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Add Classroom</Text>
      
      <Text style={styles.inputLabel}>Name/Number *</Text>
      <TextInput
        style={styles.input}
        value={classroomName}
        onChangeText={setClassroomName}
        placeholder="Enter classroom name or number"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Building (optional)</Text>
      <TextInput
        style={styles.input}
        value={classroomBuilding}
        onChangeText={setClassroomBuilding}
        placeholder="Enter building name"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Floor (optional)</Text>
      <TextInput
        style={styles.input}
        value={classroomFloor}
        onChangeText={setClassroomFloor}
        placeholder="Enter floor number"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />
      
      <Text style={styles.inputLabel}>Latitude *</Text>
      <TextInput
        style={styles.input}
        value={classroomLatitude}
        onChangeText={setClassroomLatitude}
        placeholder="Enter latitude (e.g. 37.7749)"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />
      
      <Text style={styles.inputLabel}>Longitude *</Text>
      <TextInput
        style={styles.input}
        value={classroomLongitude}
        onChangeText={setClassroomLongitude}
        placeholder="Enter longitude (e.g. -122.4194)"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitClassroom}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Add Classroom</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderEventForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Add Event</Text>
      
      <Text style={styles.inputLabel}>Title *</Text>
      <TextInput
        style={styles.input}
        value={eventTitle}
        onChangeText={setEventTitle}
        placeholder="Enter event title"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={eventDescription}
        onChangeText={setEventDescription}
        placeholder="Enter event description"
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
      />
      
      <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        value={eventStartDate}
        onChangeText={setEventStartDate}
        placeholder="e.g. 2023-12-15"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>End Date (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        value={eventEndDate}
        onChangeText={setEventEndDate}
        placeholder="e.g. 2023-12-17"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Location (optional)</Text>
      <TextInput
        style={styles.input}
        value={eventLocation}
        onChangeText={setEventLocation}
        placeholder="Enter event location"
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitEvent}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Add Event</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderTimetableForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Add Timetable Entry</Text>
      
      <Text style={styles.inputLabel}>Day *</Text>
      <TextInput
        style={styles.input}
        value={timetableDay}
        onChangeText={setTimetableDay}
        placeholder="e.g. Monday, Tuesday, etc."
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Start Time *</Text>
      <TextInput
        style={styles.input}
        value={timetableStartTime}
        onChangeText={setTimetableStartTime}
        placeholder="e.g. 09:00 AM"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>End Time *</Text>
      <TextInput
        style={styles.input}
        value={timetableEndTime}
        onChangeText={setTimetableEndTime}
        placeholder="e.g. 10:30 AM"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Subject *</Text>
      <TextInput
        style={styles.input}
        value={timetableSubject}
        onChangeText={setTimetableSubject}
        placeholder="Enter subject name"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Faculty *</Text>
      <TextInput
        style={styles.input}
        value={timetableFaculty}
        onChangeText={setTimetableFaculty}
        placeholder="Enter faculty name"
        placeholderTextColor="#999"
      />
      
      <Text style={styles.inputLabel}>Classroom *</Text>
      <TextInput
        style={styles.input}
        value={timetableClassroom}
        onChangeText={setTimetableClassroom}
        placeholder="Enter classroom name/number"
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitTimetable}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Add Timetable Entry</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeForm === 'faculty' && styles.activeTab]}
          onPress={() => setActiveForm('faculty')}
        >
          <Text style={[styles.tabText, activeForm === 'faculty' && styles.activeTabText]}>Faculty</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeForm === 'classroom' && styles.activeTab]}
          onPress={() => setActiveForm('classroom')}
        >
          <Text style={[styles.tabText, activeForm === 'classroom' && styles.activeTabText]}>Classroom</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeForm === 'event' && styles.activeTab]}
          onPress={() => setActiveForm('event')}
        >
          <Text style={[styles.tabText, activeForm === 'event' && styles.activeTabText]}>Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeForm === 'timetable' && styles.activeTab]}
          onPress={() => setActiveForm('timetable')}
        >
          <Text style={[styles.tabText, activeForm === 'timetable' && styles.activeTabText]}>Timetable</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {activeForm === 'faculty' && renderFacultyForm()}
        {activeForm === 'classroom' && renderClassroomForm()}
        {activeForm === 'event' && renderEventForm()}
        {activeForm === 'timetable' && renderTimetableForm()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 15,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminScreen; 