import {
  BookOpen, Target, MessageCircle, Dice5, Palette, Award, BookMarked,
  TrendingUp, TrendingDown, PartyPopper, Video, PenTool, MessageSquare, Users, Calendar,
  BarChart3, Heart, GraduationCap, CheckCircle2, Bell, Download,
} from 'lucide-react'

const ICON_MAP = {
  BookOpen, Target, MessageCircle, Dice5, Palette, Award, BookMarked,
  TrendingUp, TrendingDown, PartyPopper, Video, PenTool, MessageSquare, Users, Calendar,
  BarChart3, Heart, GraduationCap, CheckCircle2, Bell, Download,
}

export function getIcon(name) {
  return ICON_MAP[name] || CheckCircle2
}
