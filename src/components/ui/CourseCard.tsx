import { motion } from 'framer-motion';
import { Star, Clock, Users } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  rating: number;
  duration: string;
  students: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  index: number;
}

const CourseCard = ({ title, description, image, rating, duration, students, level, index }: CourseCardProps) => {
  const levelColors = {
    Beginner: 'bg-green-500/20 text-green-400',
    Intermediate: 'bg-yellow-500/20 text-yellow-400',
    Advanced: 'bg-red-500/20 text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="glass rounded-xl p-6 hover-lift hover-glow group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${levelColors[level]}`}>
          {level}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{students}</span>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 bg-primary hover:bg-primary-glow text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors duration-300"
      >
        Start Learning
      </motion.button>
    </motion.div>
  );
};

export default CourseCard;