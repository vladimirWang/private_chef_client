import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import homeFood from "@/assets/home-food.jpg";
import homeClothing from "@/assets/home-clothing.jpg";
import {
  homeCardInteractiveSx,
  pageShellSx,
} from "@/theme/homeChrome";
import WatterFall from "@/components/WaterFall";

// export default function HomePage() {
//   return (
//     <Box
//       className="min-h-screen"
//       sx={{
//         ...pageShellSx,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 3,
//         px: 2,
//         py: 4,
//       }}
//     >
//       <Card
//         elevation={0}
//         sx={{
//           width: "100%",
//           maxWidth: 520,
//           ...homeCardInteractiveSx,
//         }}
//       >
//         <CardActionArea component={Link} to="/yum" sx={{ display: "block" }}>
//           <CardMedia
//             component="img"
//             height={200}
//             image={homeFood}
//             alt="美食"
//             sx={{ objectFit: "cover" }}
//           />
//           <CardContent sx={{ p: 3 }}>
//             <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
//               美食
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               美食助手与相关能力入口
//             </Typography>
//           </CardContent>
//         </CardActionArea>
//       </Card>

//       <Card
//         elevation={0}
//         sx={{
//           width: "100%",
//           maxWidth: 520,
//           ...homeCardInteractiveSx,
//         }}
//       >
//         <CardActionArea component={Link} to="/fileupload" sx={{ display: "block" }}>
//           <CardMedia
//             component="img"
//             height={200}
//             image={homeClothing}
//             alt="资料上传"
//             sx={{ objectFit: "cover" }}
//           />
//           <CardContent sx={{ p: 3 }}>
//             <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
//               资料上传
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               资料上传入口
//             </Typography>
//           </CardContent>
//         </CardActionArea>
//       </Card>
//     </Box>
//   );
// }

export default function HomePage() {
  
const flowList = [
  {
    id: 1,
    type: '美食',
    title: '低脂鸡胸肉轻食沙拉',
    desc: '减脂期必备餐食，饱腹无负担',
    imgUrl: 'https://picsum.photos/id/292/400/520'
  },
  {
    id: 2,
    type: '健身',
    title: '居家平板支撑训练',
    desc: '核心力量训练，每天5分钟塑形',
    imgUrl: 'https://picsum.photos/id/176/400/600'
  },
  {
    id: 3,
    type: '美食',
    title: '全麦粗粮早餐吐司',
    desc: '低卡高纤维，健康早餐首选',
    imgUrl: 'https://picsum.photos/id/431/400/480'
  },
  {
    id: 4,
    type: '健身',
    title: '户外慢跑有氧锻炼',
    desc: '燃脂瘦身，提升身体代谢',
    imgUrl: 'https://picsum.photos/id/119/400/550'
  },
  {
    id: 5,
    type: '美食',
    title: '新鲜果蔬减脂果盘',
    desc: '维生素满满，清爽解腻',
    imgUrl: 'https://picsum.photos/id/106/400/500'
  },
  {
    id: 6,
    type: '健身',
    title: '哑铃手臂力量训练',
    desc: '打造紧致手臂线条',
    imgUrl: 'https://picsum.photos/id/342/400/620'
  },
  {
    id: 7,
    type: '美食',
    title: '无糖燕麦代餐粥',
    desc: '饱腹代餐，懒人减脂好物',
    imgUrl: 'https://picsum.photos/id/493/400/460'
  },
  {
    id: 8,
    type: '健身',
    title: '瑜伽拉伸放松体态',
    desc: '舒缓肌肉，改善驼背',
    imgUrl: 'https://picsum.photos/id/613/400/580'
  }
]
return (
  <div>
    <WatterFall list={flowList} />
  </div>
)
}