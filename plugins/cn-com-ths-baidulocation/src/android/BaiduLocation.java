package cn.com.ths.baidulocation;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PermissionHelper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.view.Gravity;
import android.widget.Toast;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;

/**
 * 百度定位插件，默认使用gcj02定位.
 */
public class BaiduLocation extends CordovaPlugin {

	private static final String ACTION_GET_LOCATION_EVENT = "get";
	private static final String ACTION_STOP_LOCATION_EVENT = "stop";

	private LocationClient mLocationClient = null;
	private BDLocationListener myListener = new MyLocationListener();
	private CallbackContext callbackContext;
	private JSONObject locationInfo;
	private Activity activity;

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		activity = cordova.getActivity();
		initGPS();
		mLocationClient = new LocationClient(activity); // 声明LocationClient类
		mLocationClient.registerLocationListener(myListener); // 注册监听函数
		initLocation();
	}

		// private String[] locPerArr = new String[] {
		// 	Manifest.permission.READ_PHONE_STATE,
		// 	Manifest.permission.ACCESS_COARSE_LOCATION,
		// 	Manifest.permission.ACCESS_FINE_LOCATION,
		// 	Manifest.permission.READ_EXTERNAL_STORAGE,
		// 	Manifest.permission.WRITE_EXTERNAL_STORAGE,
		// 	};
		/**
	 * 权限列表
	 */
		private String[] locPerArr = new String[] {
			Manifest.permission.READ_PHONE_STATE,
			
			Manifest.permission.ACCESS_FINE_LOCATION,
			Manifest.permission.READ_EXTERNAL_STORAGE
			};
     /**
	 * 检查权限并申请
	 */
	private void promtForLocation() {
		for (int i = 0, len = locPerArr.length; i < len; i++) {
			if (!PermissionHelper.hasPermission(this, locPerArr[i])) {
				PermissionHelper.requestPermission(this, i, locPerArr[i]);
				return;
			}
		}
		exeLoc(action);
	}

	@Override
	public void onRequestPermissionResult(int requestCode,
			String[] permissions, int[] grantResults) throws JSONException {
		// TODO Auto-generated method stub
		for (int r : grantResults) {
			if (r == PackageManager.PERMISSION_DENIED) {
				return;
			}
		}
		promtForLocation();
	}

	/**
	 * 执行定位操作
	 * 
	 * @param action 动作类型，开启或者停止定位
	 */
	private boolean exeLoc(String action) {
		if (ACTION_GET_LOCATION_EVENT.equals(action)) {
			cordova.getThreadPool().execute(new Runnable() {
				public void run() {
					mLocationClient.start();
				}
			});
			return true;
		} else if (ACTION_STOP_LOCATION_EVENT.equals(action)) {
			mLocationClient.stop();
			return true;
		}
		return false;
	}

	private String action = null;

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;
		this.action = action;
		promtForLocation();
		return true;
	}

	@Override
	public void onStop() {
		mLocationClient.stop();
		super.onStop();
	}

	@Override
	public void onDestroy() {
		mLocationClient.stop();
		super.onDestroy();
	}

	private void initLocation() {
		LocationClientOption option = new LocationClientOption();
		option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);// 可选，默认高精度，设置定位模式，高精度，低功耗，仅设备
		option.setCoorType("gcj02");// 可选，默认gcj02，设置返回的定位结果坐标系 bd09ll
		int span = 1000;
		option.setScanSpan(span);// 可选，默认0，即仅定位一次，设置发起定位请求的间隔需要大于等于1000ms才是有效的
		option.setIsNeedAddress(true);// 可选，设置是否需要地址信息，默认不需要
		option.setOpenGps(true);// 可选，默认false,设置是否使用gps
		option.setLocationNotify(true);// 可选，默认false，设置是否当gps有效时按照1S1次频率输出GPS结果
		option.setIsNeedLocationDescribe(true);// 可选，默认false，设置是否需要位置语义化结果，可以在BDLocation.getLocationDescribe里得到，结果类似于“在北京天安门附近”
		option.setIsNeedLocationPoiList(true);// 可选，默认false，设置是否需要POI结果，可以在BDLocation.getPoiList里得到
		option.setIgnoreKillProcess(false);// 可选，默认false，定位SDK内部是一个SERVICE，并放到了独立进程，设置是否在stop的时候杀死这个进程，默认杀死
		option.SetIgnoreCacheException(false);// 可选，默认false，设置是否收集CRASH信息，默认收集
		option.setEnableSimulateGps(false);// 可选，默认false，设置是否需要过滤gps仿真结果，默认需要
		mLocationClient.setLocOption(option);
	}

	public class MyLocationListener implements BDLocationListener {
		@Override
		public void onReceiveLocation(BDLocation location) {
			if (location == null) {
				return;
			}
			// Receive Location
			try {
				locationInfo = new JSONObject();
				locationInfo.put("time", location.getTime());
				locationInfo.put("locType", location.getLocType());
				locationInfo.put("latitude", location.getLatitude());
				locationInfo.put("longitude", location.getLongitude());
				locationInfo.put("radius", location.getRadius());
				if (location.getLocType() == BDLocation.TypeGpsLocation) {// GPS定位结果
					locationInfo.put("speed", location.getSpeed());// 单位：公里每小时
					locationInfo
							.put("satellite", location.getSatelliteNumber());
					locationInfo.put("height", location.getAltitude());// 单位：米
					locationInfo.put("direction", location.getDirection());// 单位：度
					locationInfo.put("addr", location.getAddrStr());
					locationInfo.put("province", location.getProvince());
					locationInfo.put("city", location.getCity());
					locationInfo.put("district", location.getDistrict());
					locationInfo.put("street", location.getStreet());
					locationInfo.put("describe", "gps定位成功");
				} else if (location.getLocType() == BDLocation.TypeNetWorkLocation) {// 网络定位结果
					locationInfo.put("addr", location.getAddrStr());
					locationInfo.put("province", location.getProvince());
					locationInfo.put("city", location.getCity());
					locationInfo.put("district", location.getDistrict());
					locationInfo.put("street", location.getStreet());
					// 运营商信息
					locationInfo.put("operationers", location.getOperators());
					locationInfo.put("describe", "网络定位成功");
				} else if (location.getLocType() == BDLocation.TypeOffLineLocation) {// 离线定位结果
					locationInfo.put("describe", "离线定位成功，离线定位结果也是有效的");
				} else if (location.getLocType() == BDLocation.TypeServerError) {
					locationInfo
							.put("describe",
									"服务端网络定位失败，可以反馈IMEI号和大体定位时间到loc-bugs@baidu.com，会有人追查原因");
				} else if (location.getLocType() == BDLocation.TypeNetWorkException) {
					locationInfo.put("describe", "网络不通导致定位失败，请检查网络是否通畅");
				} else if (location.getLocType() == BDLocation.TypeCriteriaException) {
					locationInfo
							.put("describe",
									"无法获取有效定位依据导致定位失败，一般是由于手机的原因，处于飞行模式下一般会造成这种结果，可以试着重启手机");
				}
				locationInfo.put("locationdescribe",
						location.getLocationDescribe());// 位置语义化信息
				callbackContext.success(locationInfo);
			} catch (JSONException e) {
				e.printStackTrace();
				callbackContext.error(e.toString());
			}
		}
	}

	private void initGPS() {
		LocationManager locationManager = (LocationManager) activity
				.getSystemService(Context.LOCATION_SERVICE);
		// 判断GPS模块是否开启，如果没有则开启
		//if (!locationManager
		//		.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)) {
		//	Toast toast = Toast.makeText(activity, "为提高定位精度，建议开启GPS",
		//			Toast.LENGTH_LONG);
		//	toast.setGravity(Gravity.CENTER, 0, 0);
		//	toast.show();
		//}
	}
}
