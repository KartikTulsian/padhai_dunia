import Announcements from "@/components/Announcements";
import InstituteChart from "@/components/InstituteChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import StudentsTable from "@/components/StudentsTable";
import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Total Students" value={1234} change={120} />
          <UserCard type="New Students" value={200} change={45} />
          <UserCard type="Total Courses" value={32} change={2} />
          <UserCard type="Fees Collection" value={550000} change={45000} />
        </div>

       {/* INSTITUTE CHART */}
        <div className="p-8 grid gap-8">
        <InstituteChart />
        </div>


        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>

        {/* NEW STUDENTS TABLE */}
        <div className="w-full">
          <StudentsTable/>
        </div>

      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
