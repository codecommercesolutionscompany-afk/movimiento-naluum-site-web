import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Hammer,
  HandHeart,
  Leaf,
  MapPin,
  MapPinned,
  MessageCircle,
  Palette,
  Plus,
  Sparkles,
  Star,
  Tent,
  Utensils,
  Users,
  XCircle,
} from 'lucide-react';

const icons = {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Hammer,
  HandHeart,
  Leaf,
  MapPin,
  MapPinned,
  MessageCircle,
  Palette,
  Plus,
  Sparkles,
  Star,
  Tent,
  Utensils,
  Users,
  XCircle,
};

const Icon = ({ name, ...props }) => {
  const Component = icons[name] || Leaf;
  return <Component {...props} />;
};

export default Icon;
