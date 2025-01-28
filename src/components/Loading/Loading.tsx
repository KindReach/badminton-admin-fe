import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className="relative w-24 h-24">
        {/* 羽毛球本體 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="w-16 h-16"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 中心圓形 */}
            <circle cx="50" cy="50" r="20" fill="white" />

            {/* 羽毛 */}
            {[0, 60, 120, 180, 240, 300].map((angle, index) => (
              <g key={angle} transform={`rotate(${angle} 50 50)`}>
                <path
                  d="M 50 30 L 45 10 L 50 15 L 55 10 L 50 30"
                  fill="white"
                  opacity="0.8"
                  className={styles.originBottom}
                  style={{
                    animation: `featherIn 1.2s ${index * 0.2}s infinite`,
                  }}
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="absolute mt-32 text-white font-medium">載入中...</div>

      {/* 添加動畫關鍵幀 */}
      <style>{`
        @keyframes featherIn {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          50% {
            transform: scaleY(1);
            opacity: 0.8;
          }
          100% {
            transform: scaleY(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
