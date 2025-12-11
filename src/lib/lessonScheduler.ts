// lib/lessonScheduler.ts
// Helper function to distribute lessons across the week

interface LessonScheduleInput {
  id: string;
  title: string;
  duration: number | null;
  orderIndex: number;
  moduleId: string;
}

export function generateLessonSchedule(
  lessons: LessonScheduleInput[],
  startDate: Date = new Date()
): Array<{ lesson: LessonScheduleInput; scheduledTime: Date }> {
  const scheduledLessons: Array<{ lesson: LessonScheduleInput; scheduledTime: Date }> = [];
  
  // Define class time slots for weekdays (Monday to Friday)
  const timeSlots = [
    { hour: 9, minute: 0 },   // 9:00 AM
    { hour: 10, minute: 0 },  // 10:00 AM
    { hour: 11, minute: 0 },  // 11:00 AM
    { hour: 13, minute: 0 },  // 1:00 PM
    { hour: 14, minute: 0 },  // 2:00 PM
    { hour: 15, minute: 0 },  // 3:00 PM
  ];

  let currentDate = new Date(startDate);
  // Start from next Monday
  const daysUntilMonday = (8 - currentDate.getDay()) % 7 || 7;
  currentDate.setDate(currentDate.getDate() + daysUntilMonday);
  
  let timeSlotIndex = 0;
  let dayOffset = 0;

  lessons.forEach((lesson) => {
    // Skip weekends
    if ((currentDate.getDay() + dayOffset) % 7 === 0 || (currentDate.getDay() + dayOffset) % 7 === 6) {
      dayOffset += (currentDate.getDay() + dayOffset) % 7 === 0 ? 1 : 2;
    }

    const scheduleDate = new Date(currentDate);
    scheduleDate.setDate(scheduleDate.getDate() + dayOffset);
    scheduleDate.setHours(timeSlots[timeSlotIndex].hour, timeSlots[timeSlotIndex].minute, 0, 0);

    scheduledLessons.push({
      lesson,
      scheduledTime: scheduleDate
    });

    // Move to next time slot
    timeSlotIndex++;
    
    // If we've exhausted time slots for the day, move to next day
    if (timeSlotIndex >= timeSlots.length) {
      timeSlotIndex = 0;
      dayOffset++;
      
      // Skip weekends
      const nextDay = (currentDate.getDay() + dayOffset) % 7;
      if (nextDay === 0) { // Sunday
        dayOffset++;
      } else if (nextDay === 6) { // Saturday
        dayOffset += 2;
      }
    }
  });

  return scheduledLessons;
}

// Alternative: Schedule lessons based on specific days and times
export function scheduleLessonsByTimetable(
  lessons: LessonScheduleInput[],
  timetable: Array<{ dayOfWeek: number; hour: number; minute: number }>,
  startWeek: Date = new Date()
): Array<{ lesson: LessonScheduleInput; scheduledTime: Date }> {
  const scheduledLessons: Array<{ lesson: LessonScheduleInput; scheduledTime: Date }> = [];
  
  let lessonIndex = 0;
  let weekOffset = 0;
  
  while (lessonIndex < lessons.length) {
    timetable.forEach((slot) => {
      if (lessonIndex >= lessons.length) return;
      
      const scheduleDate = new Date(startWeek);
      scheduleDate.setDate(scheduleDate.getDate() + weekOffset * 7);
      
      // Find the next occurrence of this day of week
      const daysUntilSlot = (slot.dayOfWeek - scheduleDate.getDay() + 7) % 7;
      scheduleDate.setDate(scheduleDate.getDate() + daysUntilSlot);
      scheduleDate.setHours(slot.hour, slot.minute, 0, 0);
      
      // Only schedule if it's in the future
      if (scheduleDate > new Date()) {
        scheduledLessons.push({
          lesson: lessons[lessonIndex],
          scheduledTime: scheduleDate
        });
        lessonIndex++;
      }
    });
    
    weekOffset++;
    
    // Safety check to prevent infinite loop
    if (weekOffset > 52) break;
  }
  
  return scheduledLessons;
}