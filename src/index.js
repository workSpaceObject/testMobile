import dva from 'dva';
import './index.html';
import './index.less';
import createLoading from 'dva-loading';
import { Toast} from 'antd-mobile';

// 1. Initialize
const app = dva({...createLoading(),
  onError(err) {
  	Toast.info(<span style={{fontSize:'0.2rem'}}>{err.message||"系统异常！！"}</span>, 1);
    debugger;
  },
});
// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));
app.model(require('./common/model'))

// 5. Start
app.start('#root');
