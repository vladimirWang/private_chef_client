import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 2,
  320: 1
};

interface WaterFallItem {
  id: number;
  type: string;
  imgUrl: string;
  title: string;
  desc: string;
}

export default function WatterFall({ list }: { list: WaterFallItem[]}) {
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