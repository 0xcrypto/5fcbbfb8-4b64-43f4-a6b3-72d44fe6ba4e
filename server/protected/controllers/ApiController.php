<?php
	class ApiController extends Controller
	{
		// Members
		/**
		 * Key which has to be in HTTP USERNAME and PASSWORD headers 
		 */
		Const APPLICATION_ID = 'ASCCPE';

		/**
		 * Default response format
		 * either 'json' or 'xml'
		 */
		private $format = 'json';
		/**
		 * @return array action filters
		 */
		public function filters()
		{
				return array();
		}

		// Actions
		public function actionList()
		{
			$options = null;
			if(isset($_GET['method'])){
				$method = $_GET['method'];
			}

			if(isset($_GET['options'])){
				$options = (array)json_decode($_GET['options']);
			}
			
			switch($_GET['model'])
			{
				case 'users':
					if($method == 'browsing'){
						$models = $this->getBookofDead($options);
					}
					else{
						$models = Users::model()->findAll();
					}
					break;
				case 'advertisement':
					$models = Advertisement::model()->findAll();
					break;
				case 'staticpage':
					$models = StaticPage::model()->findAll();
					break;
				case 'footermenu':
					$models = FooterMenu::model()->findAll();
					break;
				default:
					// Model not implemented error
					$this->_sendResponse(501, sprintf(
						'Error: Mode <b>list</b> is not implemented for model <b>%s</b>',
						$_GET['model']) );
					Yii::app()->end();
			}

			// Did we get some results?
			if(empty($models)) {
				// No
				$this->_sendResponse(200, 
						sprintf('No items where found for model <b>%s</b>', $_GET['model']) );
			} else {
				$rows = array();
				foreach($models as $model){
					if(isset($model->attributes)){
						$rows[] = $model->attributes;
					}
					else{
						$rows[] = $model;
					}
				}
				// Send the response
				$this->_sendResponse(200, CJSON::encode($rows));
			}
		}
		public function actionView()
		{
			// Check if id was submitted via GET
			if(!isset($_GET['id']))
				$this->_sendResponse(500, 'Error: Parameter <b>id</b> is missing' );

			switch($_GET['model'])
			{
				// Find respective model    
				case 'users':
					$model = Users::model()->findByPk($_GET['id']);
					break;
				case 'advertisement':
					$model = Advertisement::model()->findByPk($_GET['id']);
					break;
				case 'staticpage':
					$model = StaticPage::model()->findByPk($_GET['id']);
					break;
				default:
					$this->_sendResponse(501, sprintf(
						'Mode <b>view</b> is not implemented for model <b>%s</b>',
						$_GET['model']) );
					Yii::app()->end();
			}
			// Did we find the requested model? If not, raise an error
			if(is_null($model))
				$this->_sendResponse(404, 'No Item found with id '.$_GET['id']);
			else
				$this->_sendResponse(200, CJSON::encode($model));
		}
		public function actionCreate()
		{
			switch($_GET['model'])
			{
				// Get an instance of the respective model
				case 'users':
					$model = new Users;                    
					break;
				case 'advertisement':
					$model = new Advertisement;
					break;
				case 'staticpage':
					$model = new StaticPage;
					break;
				default:
					$this->_sendResponse(501, 
						sprintf('Mode <b>create</b> is not implemented for model <b>%s</b>',
						$_GET['model']) );
						Yii::app()->end();
			}
			
			// Try to assign POST values to attributes
			foreach($_POST as $var=>$value) {
				// Does the model have this attribute? If not raise an error
				if($model->hasAttribute($var))
					$model->$var = $value;
				else
					$this->_sendResponse(500, 
						sprintf('Parameter <b>%s</b> is not allowed for model <b>%s</b>', $var,
						$_GET['model']) );
			}
			// Try to save the model
			if($model->save())
				$this->_sendResponse(200, CJSON::encode($model));
			else {
				// Errors occurred
				$msg = "<h1>Error</h1>";
				$msg .= sprintf("Couldn't create model <b>%s</b>", $_GET['model']);
				$msg .= "<ul>";
				foreach($model->errors as $attribute=>$attr_errors) {
					$msg .= "<li>Attribute: $attribute</li>";
					$msg .= "<ul>";
					foreach($attr_errors as $attr_error)
						$msg .= "<li>$attr_error</li>";
					$msg .= "</ul>";
				}
				$msg .= "</ul>";
				$this->_sendResponse(500, $msg );
			}
		}
		public function actionUpdate()
		{
			// Parse the PUT parameters. This didn't work: parse_str(file_get_contents('php://input'), $put_vars);
			$json = file_get_contents('php://input'); //$GLOBALS['HTTP_RAW_POST_DATA'] is not preferred: http://www.php.net/manual/en/ini.core.php#ini.always-populate-raw-post-data
			$put_vars = CJSON::decode($json,true);	//true means use associative array
			switch($_GET['model'])
			{
				// Find respective model
				case 'users':
					$model = Users::model()->findByPk($_GET['id']);                    
					break;
				case 'advertisement':
					$models = Advertisement::model()->findByPk($_GET['id']);
					break;
				case 'staticpage':
					$models = StaticPage::model()->findByPk($_GET['id']);
					break;
				
				default:
					$this->_sendResponse(501, 
						sprintf( 'Error: Mode <b>update</b> is not implemented for model <b>%s</b>',
						$_GET['model']) );
					Yii::app()->end();
			}
			// Did we find the requested model? If not, raise an error
			if($model === null)
				$this->_sendResponse(400, 
						sprintf("Error: Didn't find any model <b>%s</b> with ID <b>%s</b>.",
						$_GET['model'], $_GET['id']) );
				
			// Try to assign PUT parameters to attributes
			foreach($put_vars as $var=>$value) {
				// Does model have this attribute? If not, raise an error
				if($model->hasAttribute($var))
					$model->$var = $value;
				else {
					$this->_sendResponse(500, 
						sprintf('Parameter <b>%s</b> is not allowed for model <b>%s</b>',
						$var, $_GET['model']) );
				}
			}
			// Try to save the model
			if($model->save())
				$this->_sendResponse(200, CJSON::encode($model));
			else
				// prepare the error $msg
				// see actionCreate
				// ...
				$this->_sendResponse(500, $msg );
		}
		public function actionDelete()
		{
			switch($_GET['model'])
			{
				// Load the respective model
				case 'users':
					$model = Users::model()->findByPk($_GET['id']);                    
					break;
				case 'advertisement':
					$model = Advertisement::model()->findByPk($_GET['id']);                    
					break;
				case 'staticpage':
					$model = StaticPage::model()->findByPk($_GET['id']);                    
					break;
				default:
					$this->_sendResponse(501, 
						sprintf('Error: Mode <b>delete</b> is not implemented for model <b>%s</b>',
						$_GET['model']) );
					Yii::app()->end();
			}
			// Was a model found? If not, raise an error
			if($model === null)
				$this->_sendResponse(400, 
						sprintf("Error: Didn't find any model <b>%s</b> with ID <b>%s</b>.",
						$_GET['model'], $_GET['id']) );

			// Delete the model
			$num = $model->delete();
			if($num>0)
				$this->_sendResponse(200, $num);	//this is the only way to work with backbone
			else
				$this->_sendResponse(500, 
						sprintf("Error: Couldn't delete model <b>%s</b> with ID <b>%s</b>.",
						$_GET['model'], $_GET['id']) );
		}
		private function _sendResponse($status = 200, $body = '', $content_type = 'text/html')
		{
			// set the status
			$status_header = 'HTTP/1.1 ' . $status . ' ' . $this->_getStatusCodeMessage($status);
			header($status_header);
			// and the content type
			header('Content-type: ' . $content_type);
			header("Access-Control-Allow-Origin: *");
			header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

			// pages with body are easy
			if($body != '')
			{
				// send the body
				echo $body;
			}
			// we need to create the body if none is passed
			else
			{
				// create some body messages
				$message = '';

				// this is purely optional, but makes the pages a little nicer to read
				// for your users.  Since you won't likely send a lot of different status codes,
				// this also shouldn't be too ponderous to maintain
				switch($status)
				{
					case 401:
						$message = 'You must be authorized to view this page.';
						break;
					case 404:
						$message = 'The requested URL ' . $_SERVER['REQUEST_URI'] . ' was not found.';
						break;
					case 500:
						$message = 'The server encountered an error processing your request.';
						break;
					case 501:
						$message = 'The requested method is not implemented.';
						break;
				}

				// servers don't always have a signature turned on 
				// (this is an apache directive "ServerSignature On")
				$signature = ($_SERVER['SERVER_SIGNATURE'] == '') ? $_SERVER['SERVER_SOFTWARE'] . ' Server at ' . $_SERVER['SERVER_NAME'] . ' Port ' . $_SERVER['SERVER_PORT'] : $_SERVER['SERVER_SIGNATURE'];

				// this should be templated in a real-world solution
				$body = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
						<html>
						<head>
							<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
							<title>' . $status . ' ' . $this->_getStatusCodeMessage($status) . '</title>
						</head>
						<body>
							<h1>' . $this->_getStatusCodeMessage($status) . '</h1>
							<p>' . $message . '</p>
							<hr />
							<address>' . $signature . '</address>
						</body>
						</html>';

				echo $body;
			}
			Yii::app()->end();
		}
		private function _getStatusCodeMessage($status)
		{
			// these could be stored in a .ini file and loaded
			// via parse_ini_file()... however, this will suffice
			// for an example
			$codes = Array(
				200 => 'OK',
				400 => 'Bad Request',
				401 => 'Unauthorized',
				402 => 'Payment Required',
				403 => 'Forbidden',
				404 => 'Not Found',
				500 => 'Internal Server Error',
				501 => 'Not Implemented',
			);
			return (isset($codes[$status])) ? $codes[$status] : '';
		}
		
		//$this->_checkAuth();
		private function _checkAuth()
		{
			// Check if we have the USERNAME and PASSWORD HTTP headers set?
			if(!(isset($_SERVER['HTTP_X_USERNAME']) and isset($_SERVER['HTTP_X_PASSWORD']))) {
				// Error: Unauthorized
				$this->_sendResponse(401);
			}
			$username = $_SERVER['HTTP_X_USERNAME'];
			$password = $_SERVER['HTTP_X_PASSWORD'];
			// Find the user
			$user=User::model()->find('LOWER(username)=?',array(strtolower($username)));
			if($user===null) {
				// Error: Unauthorized
				$this->_sendResponse(401, 'Error: User Name is invalid');
			} else if(!$user->validatePassword($password)) {
				// Error: Unauthorized
				$this->_sendResponse(401, 'Error: User Password is invalid');
			}
		}

		private function getBookofDead($options = NULL){
			$excludedGraves = null;
			$order = null;
			if(isset($options['excludedGraves']) && count($options['excludedGraves'])>0)
			{
				$excludedGraves = $options['excludedGraves'];
				foreach($excludedGraves as $k=>$v)
					$excludedGraves[$k]=intval($v);
			} 

			if(isset($options['birth_date']) && !empty($options['birth_date']))
			{
				//we're processing the date format
				$tmp=explode("-", $options['birth_date']);
				if(count($tmp)==3)
					$birth_date=$tmp[2].'-'.$tmp[1].'-'.$tmp[0];
				elseif(count($tmp)==2)
					$birth_date=$tmp[2].'-'.$tmp[1];
			}
			
			if(isset($options['death_date']) && !empty($options['death_date']))
			{
				//we're processing the date format
				$tmp=explode("-", $options['death_date']);
				if(count($tmp)==3)
					$death_date=$tmp[2].'-'.$tmp[1].'-'.$tmp[0];
				elseif(count($tmp)==2)
					$death_date=$tmp[2].'-'.$tmp[1];
			}

			//znicze = candles
			//kwiatki = flowers
			// 0 as koniec = 0 as end
			//zmarli = dead
			//dzieci = children
			$query = "SELECT 
                        u.user_id,
						u.name1,
                        u.surname,
						u.date_death,						
						u.date_birth,
                        pl.name_pl as place_name,
						ge.name_pl as gender_name,
						u.graveyard_id,
						u.gender,
						grave_image,
						'' as multigrave,
						'' as znicze,
						'' as kwiatki, 
						u.grave_id,
						null as ilosc,
						0 as koniec, 
						'other',
						u.place_id
                FROM 
						Users u left join gender ge on u.gender=ge.gender_id
								left join place pl on u.place_id=pl.place_id 
								left join graves gr on u.grave_id=gr.grave_id
								left join graveyards gy on u.graveyard_id=gy.graveyard_id
								left join countries c1 on u.country_id=c1.country_id
								left join countries c2 on u.country_d_id=c2.country_id
								left join religion r on u.religion_id=r.religion_id
								left join profession pr on u.profession_id=pr.profession_id
								left join sex s on u.sex_id=s.sex_id
				WHERE ( u.is_deleted=0 OR u.is_deleted=1 )" ;

				if(isset($options['firstname'])) $query.=" and u.name1 like '%".$options['firstname']."%'";
				if(isset($options['lastname'])) $query.=" and u.surname like '%".$options['lastname']."%'";
				if(isset($options['lastname_start'])) $query.=" and u.surname like '".$options['lastname_start']."%'";
				if(isset($options['birth_date'])) $query.=" and u.date_birth like '".$options['birth_date']."%'";
				if(isset($options['death_date']) && $options['death_date']=='zmarli') $query.=" and u.date_death!='0000-00-00' and u.date_death is not null"; 
				elseif(isset($options['death_date']) && $options['death_date']=='dzieci') $query.=" and PERIOD_DIFF(DATE_FORMAT(date_death,'%Y%m'),DATE_FORMAT(date_birth,'%Y%m'))/12<18"; 
				elseif(isset($options['death_date'])) $query.=" and u.date_death like '".$options['death_date']."%'";
				if(isset($options['birth_date_c']) && $options['birth_date_c']=='AC') $query.=" and (u.c_birth='AC' or u.c_birth is null or u.c_birth='')";
				elseif(isset($options['birth_date_c'])) $query.=" and u.c_birth='".$options['birth_date_c']."'";
				if(isset($options['death_date_c']) && $options['death_date_c']=='AC') $query.=" and (u.c_death='AC' or u.c_death is null or u.c_death='')";
				elseif(isset($options['death_date_c'])) $query.=" and u.c_death='".$options['death_date_c']."'";
				if(isset($options['gender'])) $query.=" and u.gender='".$options['gender']."'";
				if(isset($options['religion_id'])) $query.=" and u.religion_id='".$options['religion_id']."'";
				if(isset($options['surname_other'])) $query.=" and u.surname_other like '%".$options['surname_other']."%'";
				if(isset($options['exwife_surname'])) $query.=" and u.exwife_surname like '%".$options['exwife_surname']."%'";
				if(isset($options['place_birth'])) $query.=" and u.place_birth='".$options['place_birth']."'";
				if(isset($options['place_death'])) $query.=" and u.place_death='".$options['place_death']."'";
				if(isset($options['death_reason'])) $query.=" and u.death_reason='".$options['death_reason']."'";
				if(isset($options['hobby'])) $query.=" and u.hobby='".$options['hobby']."'";
				if(isset($options['parent_surname'])) $query.=" and (u.father_surname like '%".$options['parent_surname']."%' or u.mother_surname like '%".$parent_surname."%')";
				if(isset($options['country_birth'])) $query.=" and u.country_birth='".$options['country_birth']."'";
				if(isset($options['country_death'])) $query.=" and u.country_death='".$options['country_death']."'";
				if(isset($options['sex_id'])) $query.=" and u.sex_id='".$options['sex_id']."'";
				if(isset($options['religion_id'])) $query.=" and u.religion_id='".$options['religion_id']."'";
				if(isset($options['profession_id'])) $query.=" and u.profession_id='".$options['profession_id']."'";

				// --------------military 12 - military cemetery, 69 - professional military
				if(isset($options['graveyard_id']) && $options['graveyard_id'] == 12) 
					$query.=" and (u.graveyard_id='".$options['graveyard_id']."' OR u.profession_id='69')";
				// -------------- ten < 18
				elseif(isset($options['graveyard_id']) && $options['graveyard_id'] == 13) 
					$query.=" and (u.graveyard_id='".$options['graveyard_id']."' OR ( u.date_death!='0000-00-00' AND PERIOD_DIFF(DATE_FORMAT(date_death,'%Y%m'),DATE_FORMAT(date_birth,'%Y%m'))/12<10 ) OR ( u.date_death='0000-00-00' AND PERIOD_DIFF(DATE_FORMAT(NOW(),'%Y%m'),DATE_FORMAT(date_birth,'%Y%m'))/12<10))";
				elseif(isset($options['graveyard_id'])) $query.=" and u.graveyard_id='".$options['graveyard_id']."'";

				// if($place_id=='1') $query.=" and (u.place_id='".$place_id)."' or u.place_id>=10)";
				if(isset($options['place_id'])) $query.=" and u.place_id='".$options['place_id']."'";
				if($excludedGraves && count($excludedGraves)>0) $query.=" and u.user_id not in (".implode(",",$excludedGraves).")";


				$count_result = Yii::app()->db->createCommand("select count(user_id) as total from ($query) t")->queryRow();
				
				$end = "0 as koniec";

				if(in_array($order,array('rand','surname', 'date_death', 'date_birth', 'user_id')))
				{
					$order = $order == 'rand'?'rand()':$order;
					if($order!='rand()') $end = "IF((SELECT COUNT(uu.user_id) FROM ($query) uu WHERE uu.$order < u.$order ) >0,0,1) AS koniec";
				}
				else
					$order="rand()";
				
				$query.=' ORDER BY '.$order.' DESC LIMIT ' .($options['position'] * $options['limit']).','.$options['limit'];
				$result = Yii::app()->db->createCommand(str_replace("0 as koniec",$end,$query))->queryAll();							
				
				$data = array(); 
				$i = 0; 
				$pozostaloGrobow=$count_result['total'];
				
				
				foreach ($result as $row)
				{ 
					$row['name1']=explode("|",$row['name1']);
					$row['other']=explode("|",$row['other']);
					$row['multigrave']=array();//multigrave
					$row['znicze']=array();//znicze
					$row['kwiatki']=array();//kwiatki
					$row['ilosc']=$count_result['total'];//ilosc wszystkich grobow
					
					$date_birth=explode("-",$row['date_birth']);
					if($date_birth[1]=='00' && $date_birth[2]=='00')
						$row['date_birth']=$date_birth[0];
					elseif($date_birth[1]!='00' && $date_birth[2]=='00')
						$row['date_birth']=$date_birth[1].'-'.$date_birth[0];
					else
						$row['date_birth']=$date_birth[2].'-'.$date_birth[1].'-'.$date_birth[0];
					
					$date_death=explode("-",$row['date_death']);
					if($date_death[1]=='00' && $date_death[2]=='00')
						$row['date_death']=$date_death[0];
					elseif($date_death[1]!='00' && $date_death[2]=='00')
						$row['date_death']=$date_death[1].'-'.$date_death[0];
					else
						$row['date_death']=$date_death[2].'-'.$date_death[1].'-'.$date_death[0];
						
					if($order=='rand()')
						$row['koniec']=$pozostaloGrobow-->=1?0:1;//czy jest to juz ostatni grob
					
					$user_id=$row['user_id'];
					
					$sql="select mg2.grave_id,
								mg2.grave_image,
								mg2.family_name,
								u.name1,
								u.surname,
								u.date_death,						
								u.date_birth,
								u.grave_image,
								'' AS znicze,
								'' AS kwiatki,
								u.gender
							from multi_graves mg, multi_graves mg2, Users u 
							where mg2.grave_id=u.user_id and mg.multigrave_id=mg2.multigrave_id and mg.grave_id=".$user_id."";
					$result2 = Yii::app()->db->createCommand($sql)->queryAll();	
					foreach($result2 as $row2)
					{	//we overwrite initial data for family graves the name of the tomb
						$row['name1']=$row2['family_name'];
						$row['grave_image']=$row2['grave_image'];
						$row2['surname']=explode("|",$row2['surname']);
						///we collect flowers and candles for every deceased person in multigrain
						$candles = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$row2['grave_id']." and (object_name like 'znicz%' or object_name like 'kamien%') and end_time>now() order by add_date desc limit 5")->queryAll();	
						foreach($candles as $candle)
							$row2['znicze'][]=$candle;
							
						$flowers = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$row2['grave_id']." and object_name like 'kwiat%' and end_time>now() order by add_date desc limit 2")->queryAll();	
						foreach($flowers as $flower)
							$row2['kwiatki'][]=$flower;
							
						$row['multigrave'][]=$row2;
					}
					
					$candles = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$user_id." and (object_name like 'znicz%' or object_name like 'kamien%') and end_time>now() order by add_date desc limit 5")->queryAll();	
					foreach($candles as $candle)
						$row['znicze'][]=$candle;
						
					$flowers = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$user_id." and object_name like 'kwiat%' and end_time>now() order by add_date desc limit 2")->queryAll();	
					foreach($flowers as $flower)
						$row['kwiatki'][]=$flower;
					$data[] = $row; 
				} 

				return ($data); 
		}
	}
?>