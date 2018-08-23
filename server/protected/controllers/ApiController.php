<?php
	class ApiController extends Controller
	{
		Const APPLICATION_ID = 'ASCCPE';
		const CONFIG = array(
            'HOST_ADDRESS'=>'www.wirtualnycmentarz.pl'
        );
        const PAYMENT_CONFIG = array(
            'ADMIN_EMAIL_FROM'  => "administracja@wirtualnycmentarz.pl",
            'ADMIN_EMAIL_TO' => "admin_m@wirtualnycmentarz.pl"  
        );

		private $format = 'json';

		public function filters()
		{
				return array();
		}

		public function actionList()
		{
			$options = null;
			$method = null;

			if(isset($_GET['method'])){
				$method = $_GET['method'];
			}

			if(isset($_GET['options'])){
				$options = (array)json_decode($_GET['options']);
			}
			
			switch($_GET['model'])
			{
				case 'data':
					if($method == 'GRAVES'){
						$results = $this->getGraves($options);
					}
					else if($method == 'GRAVE_DETAILS'){
						$results = $this->getGraveDetails($options);
					}
					else if($method == 'GRAVE_USER_PHOTO'){
						$results = $this->getGraveUserPhoto($options);
					}
					else if($method == 'GRAVE_CANDLES'){
						$results = $this->getGraveLights($options);
					}
					else if($method == 'GRAVE_COMMENTS'){
						$results = $this->getGraveComments($options);
					}
					else if($method == 'CANDLE_TILE_IMAGES'){
						$results = $this->getCandleTileImages($options);
					}
					else if($method == 'FLOWER_TILE_IMAGES'){
						$results = $this->getFlowerTileImages($options);
					}
					else if($method == 'STONE_TILE_IMAGES'){
						$results = $this->getStoneTileImages($options);
					}
					else if($method == 'CARD_TILE_IMAGES'){
						$results = $this->getCardTileImages($options);
					}
					else if($method == 'ADVERTISEMENTS'){
						$results = Advertisement::model()->findAll();
					}
					else if($method == 'STATIC_PAGES'){
						$results = StaticPage::model()->findAll();
					}
					else if($method == 'FOOTER_MENUS'){
						$results = FooterMenu::model()->findAll();
					}
					else if($method == 'PET_TYPES'){
						$results = $this->getPetTypes($options);
					}
					else if($method == 'PET_GRAVES'){
						$results = $this->getPetGraves($options);
					}
					else if($method == 'PET_GRAVE_DETAILS'){
						$results = $this->getPetGraveData($options);
					}
					else if($method == 'PET_GRAVES_COMMENTS'){
						$results = $this->getPetGraveComments($options);
					}
					else if($method == 'PET_GRAVE_PHOTO'){
						$results = $this->getPetGravePhoto($options);
					}
					else if($method == 'PET_GRAVE_CANDLES'){
						$results = $this->getPetGraveCandles($options);
					}
					else if($method == 'LOGIN'){
						$results = $this->loginBuyerAndFetchGraves($options);
					}
					else{
						$results = users::model()->findAll();
					}
					break;
				default:
					// Model not implemented error
					$this->_sendResponse(501, sprintf(
						'Error: Mode <b>list</b> is not implemented for model <b>%s</b>',
						$_GET['model']) );
					Yii::app()->end();
			}

			$this->_sendResponse(200, CJSON::encode($results));

			/*
			if(empty($models)) {
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
			*/
		}
		public function actionView()
		{
			// Check if id was submitted via GET
			if(!isset($_GET['id']))
				$this->_sendResponse(500, 'Error: Parameter <b>id</b> is missing' );

			if(isset($_GET['method'])){
				$method = $_GET['method'];
			}

			if(isset($_GET['options'])){
				$options = (array)json_decode($_GET['options']);
			}
			
			switch($_GET['model'])
			{
				// Find respective model    
				case 'data':
					if($method == 'STATIC_PAGE_DETAILS'){
						$model = StaticPage::model()->findByPk($options['id']);
					}
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
			$method = null;

			$options = $_POST;

			if(isset($options['method'])){
                $method = $options['method'];
            }

			switch($_GET['model'])
			{
				 case 'data':
                    if($method == 'COMMENT'){
                        $result = $this->addComment($options);
					}
					else if($method == 'REGISTER'){
                        $result = $this->register($options);
					}
                    break;
                default:
                    $this->_sendResponse(501, 
                        sprintf('Mode <b>create</b> is not implemented for model <b>%s</b>',
                        $_GET['model']) );
                        Yii::app()->end();
			}

			if($result){
                $this->_sendResponse(200, CJSON::encode($result));
            }
            else{
                $msg = "<h1>Error</h1>";
                $msg .= sprintf("Couldn't create model <b>%s</b>", $_GET['model']);
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
					$model = users::model()->findByPk($_GET['id']);                    
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
					$model = users::model()->findByPk($_GET['id']);                    
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
		private function _checkAuth(){
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

		private function getGraves($options = NULL){
			$excludedGraves = null;
			$order = isset($options['order']) ? $options['order'] : null;
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
						users u left join gender ge on u.gender=ge.gender_id
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
				if(isset($options['visibility'])) $query.=" and u.visibility = ".$options['visibility'];
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
							from multi_graves mg, multi_graves mg2, users u 
							where mg2.grave_id=u.user_id and mg.multigrave_id=mg2.multigrave_id and mg.grave_id=".$user_id."";
					$result2 = Yii::app()->db->createCommand($sql)->queryAll();	
					foreach($result2 as $row2)
					{	//we overwrite initial data for family graves the name of the tomb
						$row['name1']=$row2['family_name'];
						$row['grave_image']=$row2['grave_image'];
						$row2['surname']=explode("|",$row2['surname']);
						///we collect flowers and candles for every deceased person in multigrain
						$candles = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$row2['grave_id']." and (object_name like 'znicz%' or object_name like 'kamien%') and end_time>now() order by add_date desc limit 5")->queryAll();	
						$row2['znicze'] = array();
						$row2['kwiatki'] = array();
						foreach($candles as $candle)
							$row2['znicze'][]=$candle;
							
						$flowers = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$row2['grave_id']." and object_name like 'kwiat%' and end_time>now() order by add_date desc limit 2")->queryAll();	
						foreach($flowers as $flower)
							$row2['kwiatki'][]=$flower;
							
						$row['multigrave'][]=$row2;
					}
					
					$candles = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$user_id." and (object_name like 'znicz%' or object_name like 'kamien%') and end_time>now() order by add_date desc limit 5")->queryAll();	
					$row2['znicze'] = array();
					foreach($candles as $candle)
						$row['znicze'][]=$candle;
						
					$flowers = Yii::app()->db->createCommand("select object_id,object_name,comment from users_objects where user_id=".$user_id." and object_name like 'kwiat%' and end_time>now() order by add_date desc limit 2")->queryAll();	
					$row2['kwiatki'] = array();
					foreach($flowers as $flower)
						$row['kwiatki'][]=$flower;
						
					$data[] = $row; 
				} 
			return ($data); 
		}

		private function getGraveDetails($options = NULL){
			$query = 'SELECT g.id_kind, g.number,
				IF((SELECT COUNT(uu.user_id) FROM users uu WHERE ( uu.is_deleted=0 OR uu.is_deleted=1 ) AND uu.user_id<u.user_id )=0,0,1) AS koniec,
				u.user_id, u.buyer_id, u.place_id,
				pl.name_pl as place_name,
						u.grave_id,
						gr.name_pl as grave_name,
						u.graveyard_id,
						gy.name_pl as graveyard_name,
						u.name1,
						u.surname,
						u.surname_other,
						u.date_birth,
						u.place_birth,
						u.country_birth,
						u.country_id,
						c1.name_pl as birth_coutry_name,
						u.date_death,
						u.place_death,
						u.country_death,
						u.country_d_id,
						c2.name_pl as death_coutry_name,
						u.death_reason,
						u.religion_name,
						u.religion_id,
						r.name_pl as religion_name,
						u.gender,
						ge.name_pl as gender_name,
						u.father_name,
						u.mother_name,
						u.childrens_names,
						u.ex_wife1,
						u.other_professions,
						u.profession_id,
						pr.name_pl as profession_name,
						u.hobby,
						u.sex_id,
						s.name_pl as sex_name,
						u.grave_image,
						null as biography,
						u.hobbyids,
						u.flash_data
				FROM 
				cyber_graves g, 
				users u left join gender ge on u.gender=ge.gender_id
						left join place pl on u.place_id=pl.place_id 
						left join graves gr on u.grave_id=gr.grave_id
						left join graveyards gy on u.graveyard_id=gy.graveyard_id
						left join countries c1 on u.country_id=c1.country_id
						left join countries c2 on u.country_d_id=c2.country_id
						left join religion r on u.religion_id=r.religion_id
						left join profession pr on u.profession_id=pr.profession_id
						left join sex s on u.sex_id=s.sex_id
				WHERE u.grave_id=g.grave_id AND ( u.is_deleted=0 OR u.is_deleted=1 ) and u.user_id='.$options['user_id'] ;
			
			$result = Yii::app()->db->createCommand($query)->queryAll();
			
			$data = array(); 
			foreach($result as $row)
			{ 
				$row['name1']=explode("|",$row['name1']);//u.name1
				$row['father_name']=explode("|",$row['father_name']);//u.father_name
				$row['mother_name']=explode("|",$row['mother_name']);//u.mother_name
				$row['childrens_names']=explode("|",$row['childrens_names']);//u.childrens_names
				$row['ex_wife1']=explode("|",$row['ex_wife1']);//u.ex_wife1
				foreach($row['ex_wife1'] as $k=>$v)//u.ex_wife1
					$row['ex_wife1'][$k]=explode("#",$v);
				
				$row['biografia']=array();//biografia
				$row['reserve_grave_users_data']=array();//dane userow rezerwaujacych grob
				
				$bio_result = Yii::app()->db->createCommand("select title,body from biography where user_id=".$row['user_id']." order by order_num")->queryAll();
				foreach($bio_result as $row2)
				{
					$row['biografia'][]=array("from"=>$row2['title'], "message"=>$row2['body']);
				}
				
				$msg_result=Yii::app()->db->createCommand("select * from msg_users where user_id=".$row['user_id'])->queryAll();
				foreach($msg_result as $row2)
				{
					$tmp1=explode("|",$row2['p1name']);
					$tmp2=explode("|",$row2['p2name']);
					$row['reserve_grave_users_data']=array(array($row2['plogin1'],$tmp1[0],$tmp1[1]), array($row2['plogin2'],$tmp2[0],$tmp2[1]));
				}
				
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
				
				$data[] = $row; 
			} 
			return ($data); 
		}

		private function getGraveUserPhoto($options = NULL){
			$data = array(); 
			$photo_result=Yii::app()->db->createCommand("select file_name,is_portrait from users_photos where user_id='".$options['user_id']."'")->queryAll();
			foreach($photo_result as $row) { 
				$data[] = $row; 
			} 
			return ($data); 
		}

		private function getGraveLights($options = NULL){
			$query="select object_id,object_name,comment,end_time, '' AS a, uo_id from users_objects where 
				user_id='".$options['user_id']."' and end_time>now()";	
        
			if($options['object_name']=='znicz')
				$query.=" and (object_name like 'znicz%' or object_name like 'kamien%')";
			elseif($options['object_name'] != '')
				$query.=" and object_name like '".$options['object_name']."%'";
			
			$count_query="select count(*) as total from ($query) t";
			$count_result = Yii::app()->db->createCommand($count_query)->queryRow()['total'];
				
			//$query.=" order by add_date desc limit " .($position*$limit).','.$limit;
			$query.=" order by add_date desc ";
			$result = Yii::app()->db->createCommand($query)->queryAll();
			$data = array(); 
			foreach ($result as $row) { 
				$row['a']=$count_result;
				$data[] = $row; 
			} 
			return ($data); 
		}

		private function getGraveComments($options = NULL){
			$query="select * from users_comments where user_id='".$options['user_id']."' and validated>=0 order by add_date desc";
			$count_result = Yii::app()->db->createCommand("select count(*) as total from ($query) t")->queryRow()['total'];
			$result=Yii::app()->db->createCommand($query)->queryAll();
			$data = array(); 
			foreach ($result as $row) { 
				$row['total'] = $count_result;
				$data[] = $row; 
			} 
			return ($data); 
		}

		private function getCandleTileImages($options = NULL){
			$data = array(); 
			$d = dir("../client/dist/assets/images/znicze/mini_znicze/");
			while (false !== ($entry = $d->read())) {
				if($entry=='.' || $entry=='..') continue;

				$data[]=$entry;
			}
			$d->close();

			return ($data); 
		}

		private function getFlowerTileImages($options = NULL){
			$data = array(); 
			$d = dir("../client/dist/assets/images/znicze/mini_kwiaty/");
			while (false !== ($entry = $d->read())) {
			if($entry=='.' || $entry=='..') continue;
				$data[]=$entry;
			}
			$d->close();

			return ($data); 
		}

		private function getStoneTileImages($options = NULL){
			$data = array(); 
			$d = dir("../client/dist/assets/images/znicze/mini_kamienie/");
			while (false !== ($entry = $d->read())) {
			if($entry=='.' || $entry=='..') continue;
				$data[]=$entry;
			}
			$d->close();

			return ($data); 
		}

		private function getCardTileImages($options = NULL){
			$data = array(); 
			$d = dir("../client/dist/assets/images/znicze/mini_kartki/");
			while (false !== ($entry = $d->read())) {
			if($entry=='.' || $entry=='..') continue;
				$data[]=$entry;
			}
			$d->close();

			return ($data); 
		}

		private function addComment($options = NULL){
            $query="insert into users_comments (nick,body,user_id) values ('".$options['nick']."','".$options['body']."',".$options['user_id'].");";    
            Yii::app()->db->createCommand($query)->execute();
            
            if (!empty($body) || !empty($nick)) {
                try{
                    //TO-DO = Comment out for live server
                    //$this->sendEmail($options['nick'], $options['body'], $options['user_id'], 'person');
                }
                catch(Exception $e){
                }
            }
            return true;
        }

        private function sendEmail($nick, $body, $id, $grave_type = 'person') {
            $mail_to   = $this->PAYMENT_CONFIG['ADMIN_EMAIL_TO'];
            $mail_from = $this->PAYMENT_CONFIG['ADMIN_EMAIL_FROM'];

            $result = $this->MailContent('NEW_COMMENT', array('id'=>$id, 'nick'=>$nick, 'body'=>$body));
            $message  = wordwrap($result['content'], 100);          
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
            $headers .= 'From: '.$mail_from. "\r\n";
            @mail($mail_to, $result['subject'], $message, $headers);
        }

        private function MailContent($method, $parameters){
            $result = array();
            switch($method){
                case 'NEW_COMMENT': 
						$content = "<strong>Informacja dla administratora</strong><br /><br />";
						$content .= "Dodano komentarz do grobu <br />";
						if ($grave_type == 'animal')
							$content .= "zwierz�cia ANIMAL_ID: ".$parameters['id']." <a href=\"http://www.wirtualnycmentarz.pl/index.php?id_a=".$parameters['id']."\" target=\"_blank\">http://".$this->CONFIG['HOST_ADDRESS']."/index.php?id_a=".$parameters['id']."</a>.";
						else
							$content .= "osoby PERSON_ID: ".$parameters['id']." <a href=\"http://www.wirtualnycmentarz.pl/index.php?id=".$parameters['id']."\" target=\"_blank\">http://".$this->CONFIG['HOST_ADDRESS']."/index.php?id=".$parameters['id']."</a>.";

						$content .= "<br><br>";
						$content .= "Podpis pod komentarzem: <strong>".$parameters['nick']."</strong><br><br>";
						$content .= "Tre�� komentarza: <strong>".$parameters['body']."</strong><br><br>";
						$subject = "Dodano komentarz - Informacja dla administratora";

						$result['content'] = $content;
						$result['subject'] = $subject;
					break;
				case 'RESET_PASSWORD':
						$content = "We received a request to reset the password for ";
						$content .= "the account with the login ".$parameters['username']." at www.wirtualnycmentarz.pl. <br/><br/>";
						$content .= "The new password is: ".$parameters['password']." <br/><br/>We check, <br/>Building the cemetery.";
						
						$result['content'] = $content;
						$result['subject'] = $parameters['subject'];
					break;
                default:
                    break;
            }
            return $result;
        }
		
		private function getPetTypes($options = NULL){
            $query = "SELECT * FROM animals_list";
            $result = Yii::app()->db->createCommand($query)->queryAll();

            if(!empty($options['order']) && in_array($options['order'],array('al_id', 'name_pl', 'name_en'))){
                $query .= " ORDER BY ".$options['order'];
            }
            $count_query="SELECT count(*) as total FROM ($query) t";
            $count_result = Yii::app()->db->createCommand($count_query)->queryRow()['total'];
            
            $data = array();
            foreach($result as $row){
                $row['total'] = $count_result;
                $data[] = $row;
            }

            return $data;
        }

        private function getPetGraves($options = NULL){
            $date_birth = null;
            $date_death = null;
            $position = isset($options['position']) ? $options['position'] : 0;
			$limit = isset($options['limit']) ? $options['limit'] : 15;
			$data = array();
            
            if (!empty($options['date_birth'])){
                $_dateb_y = substr($options['date_birth'], 6,9);
                $_dateb_m = substr($options['date_birth'], 3,2);
                $_dateb_d = substr($options['date_birth'], 0,2);
                $date_birth = $_dateb_y.'-'.$_dateb_m.'-'.$_dateb_d;
            }
            
            if (!empty($options['date_death'])){
                $_dated_y = substr($options['date_death'], 6,9);
                $_dated_m = substr($options['date_death'], 3,2);
                $_dated_d = substr($options['date_death'], 0,2);
                $date_death = $_dated_y.'-'.$_dated_m.'-'.$_dated_d;
            }
            
            $query = "SELECT 
                        u.animal_id,
                        u.buyer_id,
                        u.al_id,
                        al.name_pl as type_name_pl,  
                        al.name_en as type_name_en,
                        u.gender,
                        ge.name_animal_pl as gender_name,  
                        u.animalkind,
                        u.name,
                        u.name2,
                        u.name3,
                        u.owner_name,
                        DATE_FORMAT(u.date_birth,'%d-%m-%Y') as date_birth,
                        DATE_FORMAT(u.date_death,'%d-%m-%Y') as date_death,
                        u.live_history,
                        u.live_history_title,
                        u.live_history_signature,
                        u.image_url,
                        u.is_deleted,
                        u.grave_image,
                        '' AS total,
                        '' AS memoriam,
                        '' AS objects,
                        '' AS d,
                        u.grave_id
                    FROM 
                        animals u left join gender ge on u.gender = ge.gender_id    
                                  left join animals_list al on u.al_id = al.al_id 
                    WHERE ( u.is_deleted=0 OR u.is_deleted=1 )";

            if (isset($options['buyer_id']) && $options['buyer_id']> 0) $query.=" AND u.buyer_id = '".$options['buyer_id']."'";
            if (isset($options['al_id']) && $options['al_id'] > 0) $query.=" AND u.al_id = '".$options['al_id']."'";
            if (isset($options['gender_id']) && $options['gender_id'] > 0) $query.=" AND u.gender = '".$options['gender_id']."'";
            if (isset($options['name'])) $query.=" and u.name like '%".$options['name']."%'";
            if (isset($options['first_letter'])) $query.=" and u.name like '".$options['first_letter']."%'";
            if (isset($options['name2'])) $query.=" and u.name2 like '%".$options['name2']."%'";
            if (isset($options['name3'])) $query.=" and u.name3 like '%".$options['name3']."%'";
            if (isset($options['owner_name'])) $query.=" and u.owner_name like '%".$options['owner_name']."%'";
            if (isset($options['date_birth'])) $query.=" and u.date_birth like '".$options['date_birth']."%'";
            if (isset($options['date_death'])) $query.=" and u.date_death like '".$options['date_death']."%'";
            if (isset($options['animal_species'])) $query.=" and u.animalkind like '%".$options['animal_species']."%'";
            if (isset($options['grave_id'])) $query.=" and u.grave_id ='".$options['grave_id']."'";

            $count_result = Yii::app()->db->createCommand("SELECT count(*) as total FROM ($query) t")->queryRow()['total'];
            
            if (in_array($options['order'], array('rand', 'animal_id', 'animal_id_desc', 'buyer_id', 'al_id', 'gender_id', 'name', 'name2', 'name3', 'owner_name', 'date_birth', 'date_death'))) {
                if ($options['order'] == 'rand') $query .= " ORDER BY rand()"; 
                elseif ($options['order'] == 'animal_id_desc') $query .= " ORDER BY animal_id DESC"; 
                else $query .= ' ORDER BY u.'.$options['order'];
            }

            $query .= ' LIMIT ' .($position*$limit).','.$limit;
            $result = Yii::app()->db->createCommand($query)->queryAll();
        
            $counter = 1;
            foreach ($result as $row)
            { 
                $row['total'] = $count_result;

                $animal_id=$row['animal_id'];

                echo "<pre>";print_r($row);echo "</pre>";exit;
                $query="select object_id,object_name,comment from animals_objects where animal_id=".$animal_id." and object_name like 'kwiat%' and end_time>now() order by add_date desc";
                $memoriam_result = Yii::app()->db->createCommand($query)->queryAll();
				$memoriam = array();
				foreach($memoriam_result as $memoriam_row){
					$memoriam[]=$memoriam_row;
				}
                
                $row['memoriam'] = $memoriam; unset($memoriam);

                $query="select object_id,object_name,comment from animals_objects where animal_id=".$animal_id." and (object_name like 'znicz%' or object_name like 'kamien%') and end_time>now() order by add_date desc";
				$object_result = Yii::app()->db->createCommand($query)->queryAll();
				$objects = array();
                foreach($object_result as $object_row){
					$objects[]=$object_row;
				}

                $row['objects'] = $objects; unset($objects);

                if ($counter < $count_result - ($position*$limit))  
                    $row['d'] = "0"; else $row['d'] = "1";
				
				$counter++;
				
				$data[] = $row; 
			}
			
            return $data;
		}

		private function getPetGraveData($options = NULL){
			$query = "SELECT 
						u.animal_id,
						u.buyer_id,
						u.al_id,
						al.name_pl as type_name_pl,  
						al.name_en as type_name_en,
						u.gender,
						ge.name_animal_pl as gender_name,  
						u.animalkind,
						u.name,
						u.name2,
						u.name3,
						u.owner_name,
						DATE_FORMAT(u.date_birth,'%d-%m-%Y') as date_birth,
						DATE_FORMAT(u.date_death,'%d-%m-%Y') as date_death,
						u.live_history,
						u.live_history_title,
						u.live_history_signature,
						u.image_url,
						u.is_deleted,
						u.grave_image
					FROM 
						animals u left join gender ge on u.gender = ge.gender_id	
						          left join animals_list al on u.al_id = al.al_id 
					WHERE ( u.is_deleted=0 OR u.is_deleted=1 ) AND u.animal_id = '".$options['id']."'";

            $result = Yii::app()->db->createCommand($query)->queryAll();
			$data = array();
			foreach($result as $row)
				$data[] = $row;
			
			return $data;
		}

        private function getPetGraveComments($options = NULL){
            $query = "SELECT * FROM animals_comments WHERE animal_id='".$options['animal_id']."' AND validated>=0 ORDER BY add_date DESC";
            $result = Yii::app()->db->createCommand($query)->queryAll();

            $count_query="SELECT count(*) as total FROM ($query) t";
            $count_result = Yii::app()->db->createCommand($count_query)->queryRow()['total'];
            
            $data = array();
            foreach($result as $row){
                $row['total'] = $count_result;
                $data[] = $row;
            }

            return $data;
        }

		private function getPetGravePhoto($options = NULL){
			$query = "select file_name,is_portrait from animals_photos where animal_id='".$options['id']."'";		

			$result = Yii::app()->db->createCommand($query)->queryAll();
			$data = array();
			foreach($result as $row)
				$data[] = $row;
			
			return $data;
		}

		private function getPetGraveCandles($options = NULL){
			$data = array();

			$query = "SELECT object_id,object_name,comment,end_time,'' AS total, ao_id FROM animals_objects 
				WHERE animal_id='".$options['id']."' AND end_time>now()";	
        
	        if($options['object_name']=='znicz')
		    	$query.=" AND (object_name LIKE 'znicz%' OR object_name LIKE 'kamien%')";
			elseif($options['object_name']!='')
        		$query.=" AND object_name LIKE '".$options['object_name']."%'";
        	
		    $count_result = Yii::app()->db->createCommand("SELECT count(*) as total FROM ($query) t")->queryRow()['total'];
			
		    $query .= " ORDER BY add_date DESC ";

			$result = Yii::app()->db->createCommand($query)->queryAll(); 
        
			foreach ($result as $row) { 
	        	$row['total']=$count_result;
				$data[] = $row; 
			} 

			return $data;
		}

		private function loginBuyerAndFetchGraves($options = NULL){
			$password = $options['password'];
			$encrypted_password = md5($password);
			$data = array();

			$query="select buyer_id, name, surname, email, phone, null as graves, 
			free from buyers where login='".$options['username']."' 
			and pass='".$encrypted_password."'";

			$buyer = Yii::app()->db->createCommand($query)->queryRow();
			
			if($buyer){
				//$_SESSION["islogged"] = 1;
				//$_SESSION["buyerid"] = $row[0];
				$query = "select user_id,name1,surname,date_birth,date_death from users where 
				( is_deleted=0 OR is_deleted=1 ) and buyer_id='".$buyer['buyer_id']."' 
				order by user_id desc";

				$result = Yii::app()->db->createCommand($query)->queryAll();
				$buyer['graves']=array();
				foreach($result as $row)
				{
					$row['name1']=explode("|",$row['name1']);
					$buyer['graves'][]=$row;
				}
				
				//$_SESSION['allowed_graves']=array();
				//foreach($out[5] as $v)	$_SESSION['allowed_graves'][]=$v[0];

				$data['buyer'] = $buyer;
			}
			else{
				$data['status'] = 'BUYER_NOT_FOUND';
				$data['buyer'] = [];
			}
        	return $data;
		}

		private function resetPassword($options = NULL){
			$sql="select email from buyers where login='".$options['username']."'";	
        	$buyer = Yii::app()->db->createCommand($query)->queryRow();
        	
			//generate new password
			$new_password = substr(md5(uniqid(rand(), true)),0,8);
			
			$result = $this->MailContent('RESET_PASSWORD', array(
				'username'=>$options['username'],
				'password'=>$new_password,
				'subject' =>'Resetowanie hasla w wirtualnym cmentarzu'
			));

			$headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
            $headers .= 'From: admin_m@wirtualnycmentarz.pl' . "\r\n";
			@mail($buyer['email'], $result['subject'], $result['message'], $headers);
			
			$query="update buyers set pass=md5('$new_password') where login='".$options['username']."'";
			Yii::app()->db->createCommand($query)->execute();

			$data = array();
			$data['status'] = 'PASSWORD_CHANGED';
			return $data;
		}
		
		private function register($options = NULL){
			$current_language = 'en';
			$buyer = null;
			$query="select * from buyers where email='".$options['email']."' or login='".$options['username']."'";	
			$buyer = Yii::app()->db->createCommand($query)->queryRow();
			$data = array();

			if($buyer){
				$data['status'] = 'BUYER_ALREADY_EXISTS';
			}
			else{
				$query="insert into buyers (name,surname,email,phone,login,pass,language)
				 values ('".$options['firstname']."',
				 '".$options['lastname']."',
				 '".$options['email']."',
				 '".$options['phone']."',
				 '".$options['username']."',
				 '".md5($options['password'])."',
				 '".$current_language."')";	
				 $result = Yii::app()->db->createCommand($query)->execute();
				 if($result){
					$data['status'] = 'BUYER_CREATED';
					$data['buyer_id'] = Yii::app()->db->getLastInsertID();
				 }
				 else{
					$data['status'] = 'PROBLEM_ADDING_BUYER';
				 }
			}
            return $data;
		}
		
		private function payment($options = NULL){
			$session_id=md5(uniqid(rand(), true));
			$current_language = 'en';
			$data = array();

			$query = "insert into payments(session_id, paymenttime, firstname, lastname, 
			description, amount, pay_method, language, buyer_id) values 
			('".$session_id."',now(),'".$options['firstname']."','".$options['lastname']."','"
			.$options['description']."','".$options['amount']."','".$options['pay_method']."', '"
			.$current_language."','".$buyer_id."'); "; 

			$result = Yii::app()->db->createCommand($query)->execute();
			if($result){
				$data['status'] = 'PAYMENT_SUCCESS';
				$data['payment_id'] = array($order_id, $session_id);
			}
			else{
				$data['status'] = 'PROBLEM_IN_PAYMENT';
			}
			$order_id = Yii::app()->db->getLastInsertID();
			
			return $data;
		}
		
		private function emailTransfer($options = NULL){
			$buyer_login = null;
			$buyer_email = null;
			$buyer_name = null;
			$buyer_surname = null;

			$query = "SELECT buyers.* FROM buyers WHERE buyer_id=".$options['id'];	
			$buyer = Yii::app()->db->createCommand($query)->queryRow();
			
			$username = $buyer["login"];
			$email = $buyer["email"];
			$name = $buyer["name"];
			$surname = $buyer["surname"];

			$pay_description = $options['description'];
	
			include 'payments/payments_config.php';			// data for transfer and admin's email
			include("payments/EmailsTransfer_info.php");	// texts of emails and titles
	
			if (!empty($buyer_email) && !empty($payments_admin_email)) {
				
				// ========================= email do usera ==============================
				$sendto   = trim($buyer_email); // insert trim ($ buyer_email); and change $ payments_admin_email
				$sendfrom = trim($payments_admin_email_from);
				$adminmail = trim($payments_admin_email);
	
				$message  = wordwrap(trim($user_text), 100);			
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
				$headers .= 'From: '.$sendfrom. "\r\n";
				$headers .= 'Bcc: '.$adminmail. "\r\n";
				@mail($sendto, $user_subject, $message, $headers);
	
				// ========================= email do admina =============================
				$sendto   = trim($payments_admin_email);
				$sendfrom = trim($payments_admin_email_from);
		
				$message  = wordwrap(trim($admin_text), 100);			
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
				$headers .= 'From: '.$sendfrom. "\r\n";
				@mail($sendto, $admin_subject, $message, $headers);
				return true;
			} else {
				return false;			
			}
		}
	}
?>