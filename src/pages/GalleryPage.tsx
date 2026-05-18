// React 19 移动端瀑布流（完全可用）
import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 2,
  320: 1
};

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
  

export default function GalleryPage() {
  return (
    <div>
      <WatterFall list={flowList} />
    </div>
  )
}

function WatterFall({ list }: { list: typeof flowList }) {
  return (
    <div style={{ padding: '10px' }}>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {list.map((item) => (
          <div key={item.id} style={{ marginBottom: 12, borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
            <img
              src={item.imgUrl}
              style={{ width: '100%', display: 'block' }}
              loading="lazy"
            />
            <div style={{ padding: 10 }}>{item.title}</div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}