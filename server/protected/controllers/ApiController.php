<?php
	class ApiController extends Controller
	{
		const APPLICATION_ID = 'ASCCPE';
		const CLIENT_APP_PHOTOS_FOLDER = "../../../client/dist/assets/images/zdjecia/";
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
					if($method == 'TODAY_DATE')
						$results = $this->getTodayDate();
					else if($method == 'PERSON')
						$results = $this->getPerson($options);
					else if($method == 'PERSONS')
						$results = $this->getPersons($options);
					else if($method == 'PERSON_DETAILS')
						$results = $this->getPersonDetails($options);
					else if($method == 'PERSON_PHOTOS')
						$results = $this->getPersonPhotos($options);
					else if($method == 'PERSON_TEMP_PHOTOS')
						$results = $this->getPersonTemporaryPhotos($options);
					else if($method == 'PERSON_OBJECTS')
						$results = $this->getPersonObjects($options);
					else if($method == 'PERSON_COMMENTS')
						$results = $this->getPersonComments($options);
					else if($method == 'ANIMAL_TYPES')
						$results = $this->getAnimalTypes($options);
					else if($method == 'ANIMALS')
						$results = $this->getAnimals($options);
					else if($method == 'ANIMAL_DETAILS')
						$results = $this->getAnimalDetails($options);
					else if($method == 'ANIMAL_COMMENTS')
						$results = $this->getAnimalComments($options);
					else if($method == 'ANIMAL_PHOTOS')
						$results = $this->getAnimalPhotos($options);
					else if($method == 'ANIMAL_TEMP_PHOTOS')
						$results = $this->getAnimalTemporaryPhotos($options);
					else if($method == 'ANIMAL_OBJECTS')
						$results = $this->getAnimalObjects($options);
					else if($method == 'TOMBS')
						$results = $this->getTombs($options);
					else if($method == 'CANDLE_TILE_IMAGES')
						$results = $this->getCandleTileImages($options);
					else if($method == 'FLOWER_TILE_IMAGES')
						$results = $this->getFlowerTileImages($options);
					else if($method == 'STONE_TILE_IMAGES')
						$results = $this->getStoneTileImages($options);
					else if($method == 'CARD_TILE_IMAGES')
						$results = $this->getCardTileImages($options);
					else if($method == 'PERSON_GRAVE_TILE_IMAGES')
						$results = $this->getPersonGraveTileImages($options);
					else if($method == 'ANIMAL_GRAVE_TILE_IMAGES')
						$results = $this->getAnimalGraveTileImages($options);
					else if($method == 'CATACOMB_SMALL_TILE_IMAGES')
						$results = $this->getCatacombSmallTileImages($options);
					else if($method == 'CATACOMB_LARGE_TILE_IMAGES')
						$results = $this->getCatacombLargeTileImages($options);
					else if($method == 'LOGIN')
						$results = $this->loginBuyerAndFetchGraves($options);
						else if($method == 'ADVERTISEMENTS')
						$results = Advertisement::model()->findAll();
					else if($method == 'STATIC_PAGES')
						$results = StaticPage::model()->findAll();
					else if($method == 'FOOTER_MENUS')
						$results = FooterMenu::model()->findAll();
					else if($method == 'PRICES')
						$results = $this->getPrices($options);
					else if($method == 'COMMUNITIES')
						$results = $this->getCommunities($options);
					else if($method == 'RELIGIONS')
						$results = $this->getReligions($options);
					else
						$results = array();
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
			$files = $_FILES;

			if(isset($options['method'])){
                $method = $options['method'];
            }

			switch($_GET['model'])
			{
				 case 'data':
                    if($method == 'PERSON_COMMENT')
                        $result = $this->addPersonComment($options);
				    else if($method == 'ANIMAL_COMMENT')
                        $result = $this->addAnimalComment($options);
					else if($method == 'REGISTER')
						$result = $this->register($options);
					else if($method == 'RESET_PASSWORD')
						$result = $this->resetPassword($options);
					else if($method == 'ADD_PERSON')
						$result = $this->addPerson($options);
					else if($method == 'ADD_PERSON_MULTI_GRAVES')
						$result = $this->addMultigrave($options);
					else if($method == 'ADD_PERSON_OBJECT')
						$result = $this->addPersonObject($options);
					else if($method == 'ADD_PERSON_TEMP_PHOTO')
						$result = $this->addPersonTemporaryPhoto($options, $files);
					else if($method == 'PERSON_TEMP_PHOTOS_DELETE')
							$results = $this->deleteAnimalTemporaryPhoto($options);
					else if($method == 'ADD_ANIMAL')
						$result = $this->addAnimal($options);
					else if($method == 'ADD_ANIMAL_OBJECT')
						$result = $this->addAnimalObject($options);
					else if($method == 'ADD_ANIMAL_TEMP_PHOTO')
						$result = $this->addAnimalTemporaryPhoto($options, $files);
					else if($method == 'ANIMAL_TEMP_PHOTOS_DELETE')
						$results = $this->deleteAnimalTemporaryPhoto($options);
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

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['order'] -> 'rand','surname', 'date_death', 'date_birth', 'user_id'

			optional $options['excludedGraves']
			optional $options['birth_date']
			optional $options['death_date']
			optional $options['firstname']
			optional $options['visibility']
			optional $options['lastname']
			optional $options['lastname_start']
			optional $options['birth_date_c']
			optional $options['death_date_c']
			optional $options['gender']
			optional $options['religion_id']
			optional $options['surname_other']
			optional $options['exwife_surname']
			optional $options['place_birth']
			optional $options['place_death']
			optional $options['death_reason'])
			optional $options['hobby']
			optional $options['parent_surname']
			optional $options['country_birth']
			optional $options['country_death']
			optional $options['sex_id']
			optional $options['religion_id']
			optional $options['profession_id']
			optional $options['graveyard_id']
			optional $options['place_id']

		***/

		private function getPersons($options = NULL){
			$excludedGraves = null;
			$birth_date = null;
			$death_date = null;
            $position = isset($options['position']) ? $options['position'] : 0;
			$limit = isset($options['limit']) ? $options['limit'] : 15;
			$order = isset($options['order']) ? $options['order'] : null;
			
			if(isset($options['excludedGraves']) && count($options['excludedGraves'])>0)
			{
				$excludedGraves = $options['excludedGraves'];
				foreach($excludedGraves as $k=>$v)
					$excludedGraves[$k]=intval($v);
			} 

			if(isset($options['birth_date']))
			{
                $_dateb_y = substr($options['birth_date'], 0,4);
                $_dateb_m = substr($options['birth_date'], 5,7);
				$_dateb_d = substr($options['birth_date'], 8,10);
				$birth_date = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
			}
			
			if(isset($options['death_date']))
			{
                $_dateb_y = substr($options['death_date'], 0,4);
                $_dateb_m = substr($options['death_date'], 5,7);
				$_dateb_d = substr($options['death_date'], 8,10);
				$death_date = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
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
						'' as objects, 
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
			
			$query.=' ORDER BY '.$order.' DESC LIMIT ' .($position * $limit).','.$limit;
			$result = Yii::app()->db->createCommand(str_replace("0 as koniec",$end,$query))->queryAll();							
			
			$data = array(); 
			$i = 0; 
			foreach ($result as $row)
			{ 
				$row['name1']=explode("|",$row['name1']);
				$row['other']=explode("|",$row['other']);
				$row['multigrave']=array();//multigrave
				$row['objects']=array();//znicze -> candles
				$row['ilosc']=$count_result['total'];// number of all graves
					
				if(isset($row['date_birth'])){
					$_dateb_y = substr($row['date_birth'], 0,4);
					$_dateb_m = substr($row['date_birth'], 5,7);
					$_dateb_d = substr($row['date_birth'], 8,10);
					$row['date_birth'] = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
				}
				
				if(isset($row['date_death'])){
					$_dateb_y = substr($row['date_death'], 0,4);
					$_dateb_m = substr($row['date_death'], 5,7);
					$_dateb_d = substr($row['date_death'], 8,10);
					$row['date_death'] = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
				}

				if($order=='rand()')
					$row['koniec']= ($count_result['total'] == 1 ) ? true : false; // is it the last grave?
				
				$user_id=$row['user_id'];
				
				$sql="select mg2.grave_id,
							mg2.grave_image,
							mg2.family_name,
							u.name1,
							u.surname,
							u.date_death,						
							u.date_birth,
							u.grave_image,
							'' AS objects,
							u.gender
						from multi_graves mg, multi_graves mg2, users u 
						where mg2.grave_id=u.user_id and mg.multigrave_id=mg2.multigrave_id and mg.grave_id=".$user_id."";
				$result2 = Yii::app()->db->createCommand($sql)->queryAll();	
				foreach($result2 as $row2)
				{
					//we overwrite initial data for family graves the name of the tomb
					$row['name1'] = $row2['family_name'];
					$row['grave_image'] = $row2['grave_image'];
					$row2['surname'] = explode("|", $row2['surname']);

					///we collect flowers and candles for every deceased person in multigrain
					//znicze or kmien or kwiatki = candle or stone or flower
					$objects = Yii::app()->db->createCommand("select object_id, object_name, comment from users_objects where user_id=".$row2['grave_id']." and (object_name like 'znicz%' or object_name like 'kamien%' or object_name like 'kwiat%') and end_time>now() order by add_date desc")->queryAll();	
					$row2['objects'] = array();
					foreach($objects as $object)
						$row2['objects'][]=$object;
						
					$row['multigrave'][]=$row2;
				}
				
				//znicze or kmien or kwiatki= candle or stone or flower
				$objects = Yii::app()->db->createCommand("select object_id, object_name, comment from users_objects where user_id=".$user_id." and (object_name like 'znicz%' or object_name like 'kamien%' or object_name like 'kwiat%') and end_time>now() order by add_date desc")->queryAll();	
				$row2['objects'] = array();
				foreach($objects as $object)
					$row['objects'][]=$object;
				
				$data[] = $row; 
			} 
			return ($data); 
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['user_id']
		***/

		private function getPersonDetails($options = NULL){
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
				$row['name1']=explode("|",$row['name1']);
				$row['father_name']=explode("|",$row['father_name']);
				$row['mother_name']=explode("|",$row['mother_name']);
				$row['childrens_names']=explode("|",$row['childrens_names']);
				$row['ex_wife1']=explode("|",$row['ex_wife1']);
				foreach($row['ex_wife1'] as $k=>$v)
					$row['ex_wife1'][$k]=explode("#",$v);
				
				$row['biografia']=array();
				$row['reserve_grave_users_data']=array();
				
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
				
				if(isset($row['date_birth'])){
					$_dateb_y = substr($row['date_birth'], 0,4);
					$_dateb_m = substr($row['date_birth'], 5,7);
					$_dateb_d = substr($row['date_birth'], 8,10);
					$row['date_birth'] = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
				}
				
				if(isset($options['date_death'])){
					$_dateb_y = substr($row['date_death'], 0,4);
					$_dateb_m = substr($row['date_death'], 5,7);
					$_dateb_d = substr($row['date_death'], 8,10);
					$row['date_death'] = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
				}

				$data[] = $row; 
			} 
			return ($data); 
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['user_id']
		***/

		private function getPersonPhotos($options = NULL){
			$data = array(); 
			$photo_result=Yii::app()->db->createCommand("select file_name,is_portrait from users_photos where user_id='".$options['user_id']."'")->queryAll();
			foreach($photo_result as $row) { 
				$data[] = $row; 
			} 
			return ($data); 
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['object_name']
			$options['user_id']
		***/

		private function getPersonObjects($options = NULL){
			$query="select object_id,object_name,comment,end_time, '' AS total, uo_id from users_objects where 
				user_id='".$options['user_id']."' and end_time>now()";	
		
			if(isset($options['object_name'])){
				if($options['object_name']=='znicz')
					$query.=" and (object_name like 'znicz%' or object_name like 'kamien%')";
				elseif($options['object_name'] != '')
					$query.=" and object_name like '".$options['object_name']."%'";
			}
			
			$count_query="select count(*) as total from ($query) t";
			$count_result = Yii::app()->db->createCommand($count_query)->queryRow()['total'];
			$query.=" order by add_date desc ";
			$result = Yii::app()->db->createCommand($query)->queryAll();
			$data = array(); 
			foreach ($result as $row) { 
				$row['total']=$count_result;
				$data[] = $row; 
			} 
			return ($data); 
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['user_id']
		***/

		private function getPersonComments($options = NULL){
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

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['grave_type']

			OPTIONAL PARAMETERS
			$options['community']
		***/
		private function getPersonGraveTileImages($options = NULL){
			$query = "SELECT grave as grave FROM grave_master WHERE  grave_type='".$options['grave_type']."'";
			(isset($options['community'])) ? $query.=" AND community='".$options['community']."'": "";

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

		private function getAnimalGraveTileImages($options = NULL){
			$query = "SELECT grave as grave FROM grave_master WHERE  grave_type='".$options['grave_type']."'";
			(isset($options['community'])) ? $query.=" AND community='".$options['community']."'": "";

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
		
		private function getCatacombSmallTileImages($options = NULL){
			$data = array(); 
			$d = dir("../client/dist/assets/images/graves/katak_mini/");
			while (false !== ($entry = $d->read())) {
			if($entry=='.' || $entry=='..') continue;
				$data[]=$entry;
			}
			$d->close();
			return ($data);
		}

		private function getCatacombLargeTileImages($options = NULL){
			$data = array(); 
			$d = dir("../client/dist/assets/images/graves/katak_maxi/");
			while (false !== ($entry = $d->read())) {
			if($entry=='.' || $entry=='..') continue;
				$data[]=$entry;
			}
			$d->close();
			return ($data);
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['body']
			$options['nick']
			$options['user_id']
		***/

		private function addPersonComment($options = NULL){
			$data = array();
			$query="insert into users_comments (nick,body,user_id) values 
			('".$options['nick']."','".$options['body']."',".$options['user_id'].");";    
            
			if(Yii::app()->db->createCommand($query)->execute()){
				$data['status'] = 'USER_COMMENT_ADDED';
				$data['comment_id'] = Yii::app()->db->getLastInsertID();
				
				try{
				
					$mail_to   = ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO'];
					$mail_from = ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM'];
	
					$result = $this->MailContent('NEW_COMMENT', array('id'=>$options['user_id'], 
					'nick'=>$options['nick'], 'body'=>$options['body'], 'grave_type'=>'person'));
					$message  = wordwrap($result['message'], 100);          
					$headers  = 'MIME-Version: 1.0' . "\r\n";
					$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
					$headers .= 'From: '.$mail_from. "\r\n";
	
					//TO-DO = Comment out for live server
					//@mail($mail_to, $result['subject'], $message, $headers);
				}
				catch(Exception $e){
					$data['status'] = 'PERSON_COMMENT_ERROR';
				}
			}
			else{
				$data['status'] = 'PERSON_COMMENT_ERROR';
			}

            return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['body']
			$options['nick']
			$options['animal_id']
		***/

		private function addAnimalComment($options = NULL){
			$data = array();
		    $query = "SELECT animals.animal_id FROM animals WHERE animals.animal_id 
			= '".$options['animal_id']."'";	
			$animal = Yii::app()->db->createCommand($query)->queryRow();

			if($animal){
				$query = "insert into animals_comments (nick, body, animal_id) 	
				values ('".$options['nick']."',
				'".$options['body']."',
				'".$options['animal_id']."')";
				if(Yii::app()->db->createCommand($query)->execute()){
					$data['status'] = 'ANIMAL_COMMENT_ADDED';
					$data['comment_id'] = Yii::app()->db->getLastInsertID();
					try{
						
						$mail_to   = ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO'];
						$mail_from = ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM'];

						$result = $this->MailContent('NEW_COMMENT', array('id'=>$options['animal_id'], 
						'nick'=>$options['nick'], 'body'=>$options['body'], 'grave_type'=>'animal'));
						$message  = wordwrap($result['message'], 100);          
						$headers  = 'MIME-Version: 1.0' . "\r\n";
						$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
						$headers .= 'From: '.$mail_from. "\r\n";

						//TO-DO = Comment out for live server
						//@mail($mail_to, $result['subject'], $message, $headers);
					}
					catch(Exception $e){
						$data['status'] = 'ANIMAL_COMMENT_ERROR';
					}
						
				}
				else{
					$data['status'] = 'ANIMAL_COMMENT_ERROR';
				}
			}
			else{
				$data['status']='ANIMAL_NOT_EXISTS';
			}
			
			return $data;
		}

		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['unique_id']
		***/

		private function getPersonTemporaryPhotos($options = NULL){
			$data = array();
			$query="select * from users_photos_temp where uniq_id='".$options['unique_id']."'";
			$result = Yii::app()->db->createCommand($query)->queryAll();
			foreach ($result as $row) { 
				$data[] = $row; 
			}
		    
			return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['unique_id']
		***/

		private function getAnimalTemporaryPhotos($options = NULL){
			$data = array();
			$query="select * from animals_photos_temp where uniq_id='".$options['unique_id']."'";
			$result = Yii::app()->db->createCommand($query)->queryAll();
			foreach ($result as $row) { 
				$data[] = $row; 
			}
		    
			return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['order'] = 'al_id', 'name_pl', 'name_en'

		***/
		
		private function getAnimalTypes($options = NULL){
            $query = "SELECT * FROM animals_list";
            $result = Yii::app()->db->createCommand($query)->queryAll();

            if(isset($options['order']) && in_array($options['order'],array('al_id', 'name_pl', 'name_en'))){
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

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['order'] = 'name_pl', 'name_en'

		***/
		
		private function getReligions($options = NULL){
            $query = "SELECT * FROM religion";
            $result = Yii::app()->db->createCommand($query)->queryAll();

            if(isset($options['order']) && in_array($options['order'],array('name_pl', 'name_en'))){
                $query .= " ORDER BY ".$options['order'];
            }
			
			$data = array();
            foreach($result as $row){
                $data[] = $row;
            }

            return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			optional - $options['position']
			optional - $options['limit']
			optional - $options['order'] -> 'rand', 'animal_id', 'animal_id_desc', 'buyer_id', 
			'al_id', 'gender_id', 'name', 'name2', 'name3', 'owner_name', 'date_birth', 'date_death'
			optional - $options['date_birth']
			optional - $options['date_death']
			optional - $options['buyer_id']
			optional - $options['al_id'] = primary key of animal table
			optional - $options['gender_id']
			optional - $options['name']
			optional - $options['first_letter']
			optional - $options['name2']
			optional - $options['name3']
			optional - $options['owner_name']
			optional - $options['date_birth']
			optional - $options['date_death']
			optional - $options['animal_species']
			optional - $options['grave_id']
		***/

        private function getAnimals($options = NULL){
            $date_birth = null;
            $date_death = null;
            $position = isset($options['position']) ? $options['position'] : 0;
			$limit = isset($options['limit']) ? $options['limit'] : 15;
			$data = array();
            
            if (isset($options['date_birth'])){
                $_dateb_y = substr($options['date_birth'], 0,4);
                $_dateb_m = substr($options['date_birth'], 5,7);
                $_dateb_d = substr($options['date_birth'], 8,10);
                $date_birth = $_dateb_y.'-'.$_dateb_m.'-'.$_dateb_d;
            }
            
            if (isset($options['date_death'])){
                $_dated_y = substr($options['date_death'], 0,4);
                $_dated_m = substr($options['date_death'], 5,7);
                $_dated_d = substr($options['date_death'], 8,10);
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
            if (isset($options['date_birth'])) $query.=" and u.date_birth like '".$date_birth."%'";
            if (isset($options['date_death'])) $query.=" and u.date_death like '".$date_death."%'";
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

                $query="select object_id,object_name,comment from animals_objects where animal_id=".$animal_id." and object_name like 'kwiat%' and end_time>now() order by add_date desc";
                $memoriam_result = Yii::app()->db->createCommand($query)->queryAll();
				$memoriam = array();
				foreach($memoriam_result as $memoriam_row){
					$memoriam[]=$memoriam_row;
				}
                
                $row['memoriam'] = $memoriam; unset($memoriam);

                $query="select object_id, object_name, comment from animals_objects where animal_id=".$animal_id." and (object_name like 'znicz%' or object_name like 'kamien%' or object_name like 'kwiat%') and end_time>now() order by add_date desc";
				$object_result = Yii::app()->db->createCommand($query)->queryAll();
				$objects = array();
                foreach($object_result as $object_row){
					$objects[]=$object_row;
				}

				$row['objects'] = $objects; unset($objects);
				
				$query="select * from animals_list where al_id=".$row['al_id'];
                $animallist_result = Yii::app()->db->createCommand($query)->queryRow();
				
				$row['genus_en'] = $animallist_result['name_en'];
				$row['genus_pl'] = $animallist_result['name_pl'];

                if ($counter < $count_result - ($position*$limit))  
                    $row['d'] = "0"; else $row['d'] = "1";
				
				$counter++;
				
				$data[] = $row; 
			}
			
            return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['id'] = animal_id

		***/

		private function getAnimalDetails($options = NULL){
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
			foreach($result as $row){
				$query="select * from animals_list where al_id=".$row['al_id'];
                $animallist_result = Yii::app()->db->createCommand($query)->queryRow();
				
				$row['genus_en'] = $animallist_result['name_en'];
				$row['genus_pl'] = $animallist_result['name_pl'];
				
				$data[] = $row;
			}
			
			return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['id'] = animal_id

		***/

        private function getAnimalComments($options = NULL){
            $query = "SELECT * FROM animals_comments WHERE animal_id='".$options['id']."' 
			AND validated>=0 ORDER BY add_date DESC";
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
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['id'] = animal_id

		***/

		private function getAnimalPhotos($options = NULL){
			$query = "select file_name,is_portrait from animals_photos where 
			animal_id='".$options['id']."'";		

			$result = Yii::app()->db->createCommand($query)->queryAll();
			$data = array();
			foreach($result as $row)
				$data[] = $row;
			
			return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['id'] = animal_id
			$options['object_name'] = kamien->stone, 
				znicz->candle, kwiat->stone, inne->others

		***/

		private function getAnimalObjects($options = NULL){
			$data = array();

			$query = "SELECT object_id, object_name, comment, end_time,'' 
			AS total, ao_id FROM animals_objects 
				WHERE animal_id='".$options['id']."' AND end_time>now()";	
		
			if(isset($options['object_name'])){
				if($options['object_name']=='znicz')
		    		$query.=" AND (object_name LIKE 'znicz%' OR object_name LIKE 'kamien%')";
				elseif($options['object_name']!='')
        			$query.=" AND object_name LIKE '".$options['object_name']."%'";
        	}
	        $count_result = Yii::app()->db->createCommand("SELECT count(*) as total FROM ($query) t")->queryRow()['total'];
			
		    $query .= " ORDER BY add_date DESC ";

			$result = Yii::app()->db->createCommand($query)->queryAll(); 
        
			foreach ($result as $row) { 
	        	$row['total']=$count_result;
				$data[] = $row; 
			} 

			return $data;
		}

		

		/***
		 	REQUIRED PARAMETERS
			--------------------

		***/
		
		private function getCommunities($options = NULL){
            $query = "SELECT DISTINCT community as community FROM grave_master";
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

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['password']
			$options['username']
		***/

		private function loginBuyerAndFetchGraves($options = NULL){
			$password = $options['password'];
			$username = urldecode($options['username']);
			$encrypted_password = md5($password);
			$data = array();

			//TODO: REMOVE FOR SERVER
			$query="select buyer_id, name, surname, email, phone, null as graves, free from buyers where login='".$username."' and pass='".$password."'";
			
			//TODO: UNCOMMENT FOR SERVER
			//$query="select buyer_id, name, surname, email, phone, null as graves, free from buyers where login='".$username."' and pass='".$encrypted_password."'";

			$buyer = Yii::app()->db->createCommand($query)->queryRow();
			if($buyer){
				//$_SESSION["islogged"] = 1;
				//$_SESSION["buyerid"] = $row[0];
				$query = "select user_id,name1,surname,date_birth,date_death from users where ( is_deleted=0 OR is_deleted=1 ) and buyer_id='".$buyer['buyer_id']."' order by user_id desc";

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
				$data['status'] = 'LOGIN_NOT_FOUND';
				$data['buyer'] = [];
			}
        	return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['email']
		***/

		private function resetPassword($options = NULL){
			$query="select email, login from buyers where email='".$options['email']."'";	
			$buyer = Yii::app()->db->createCommand($query)->queryRow();
			if($buyer){
				$new_password = substr(md5(uniqid(rand(), true)),0,8);
				$query="update buyers set pass=md5('$new_password') where email='".$options['email']."'";
				Yii::app()->db->createCommand($query)->execute();

				$result = $this->MailContent('RESET_PASSWORD', array('username'=>$buyer['login'], 'password'=>$new_password ));
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
				$headers .= 'From: admin_m@wirtualnycmentarz.pl' . "\r\n";
				
				//TO-DO = Comment out for live server
				//@mail($buyer['email'], $result['subject'], $result['message'], $headers);
	
				$data = array();
				$data['status'] = 'PASSWORD_CHANGED';
			}
			else{
				$data = array();
				$data['status'] = 'LOGIN_NOT_FOUND';
			}
			return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['current_language']
			$options['firstname']
			$options['lastname']
			$options['email']
			$options['phone']
			$options['username']
			$options['password']
		***/

		private function register($options = NULL){
			$current_language = isset($options['current_language']) ? $options['current_language'] : 'en';
			$buyer = null;
			$query="select * from buyers where email='".$options['email']."' or login='".$options['username']."'";	
			$buyer = Yii::app()->db->createCommand($query)->queryRow();
			$data = array();

			if($buyer){
				$data['status'] = 'LOGIN_ALREADY_EXISTS';
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
					$data['status'] = 'SUCCESS';
					$data['buyer_id'] = Yii::app()->db->getLastInsertID();
				 }
				 else{
					$data['status'] = 'ERROR';
				 }
			}
            return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['buyer_id']
			$options['current_language']
			$options['firstname']
			$options['lastname']
			$options['description']
			$options['amount']
			$options['pay_method']
		***/
		
		private function payment($options = NULL){
			$session_id=md5(uniqid(rand(), true));
			$current_language = isset($options['current_language']) ? $options['current_language'] : 'en';
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
				$data['order_id'] = Yii::app()->db->getLastInsertID();
			}
			else{
				$data['status'] = 'PAYMENT_FAIL';
			}
			
			return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['buyer_id']
			$options['id'] = user_id or animal_id;
			$options['amount']
			$options['account_number']
			$options['address_data']
			$options['description']
		***/
		
		private function emailTransfer($options = NULL){

			$data = array();
			try{
				$query = "SELECT buyers.* FROM buyers WHERE buyer_id=".$options['buyer_id'];	
				$buyer = Yii::app()->db->createCommand($query)->queryRow();
				
				$buyer_id = $buyer["buyer_id"];
				$username = $buyer["login"];
				$email = $buyer["email"];
				$name = $buyer["name"];
				$surname = $buyer["surname"];
				$sendto   = trim($email);
				$sendfrom = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM']);
				$adminmail = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO']);

				$result = $this.MailContent('PAYMENT_USER_MAIL', array('amount'=>$options['amount'], 
				'account_number'=>$options['account_number'], 'address_data'=>$options['address_data'], 
				'id'=>$options['id']));

				$message  = wordwrap(trim($result['message']), 100);			
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
				$headers .= 'From: '.$sendfrom. "\r\n";
				$headers .= 'Bcc: '.$adminmail. "\r\n";
				
				//TO-DO = Comment out for live server
				//@mail($sendto, $result['subject'], $message, $headers);

				$sendto   = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO']);
				$sendfrom = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM']);
				$result = $this.MailContent('PAYMENT_ADMIN_MAIL', 
				array('login'=>$username, 'buyer_id'=>$buyer_id, 'name'=>$name,
				'surname'=>$surname, 'amount'=>$options['amount'], 'id'=>$options['id'], 
				'pay_description'=>$options['description']));

				$message  = wordwrap(trim($result['message']), 100);			
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
				$headers .= 'From: '.$sendfrom. "\r\n";

				//TO-DO = Comment out for live server
				//@mail($sendto, $result['subject'], $message, $headers);

				$data['status'] = 'PAYMENT_MAIL_SUCCESS';
			} catch(Exception $e){
				$data['status'] = 'PAYMENT_MAIL_FAIL';
			}
			
			return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['payment_method']
			$options['animal_id']
			$options['buyer_id']
			$options['payment_id']
			$options['temp']
			$options['current_language']
			$options['valid_upto']
			$options['comment']
			$options['object_name']
		***/

		private function addAnimalObject($options = NULL){
			$payment_method = isset($options['payment_method']) ? $options['payment_method'] : -1; 
			$payment_id = isset($options['payment_id']) ? $options['payment_id'] : 0;
			$temp = isset($options['temp']) ? $options['temp'] : 0;
			$current_language = isset($options['current_language']) ? $options['current_language'] : 'en';
			$valid_upto =  date("Y-m-d", strtotime($options['valid_upto']));
			$data = array();

			$query = "SELECT count(ao_id) as total FROM animals_objects WHERE 
				animal_id='".$options['animal_id']."' AND object_name='".$options['object_name']."' AND 
				comment='".$options['comment']."' AND DATE_ADD(add_date,INTERVAL 1 MINUTE)>now() ";

			$count_result = Yii::app()->db->createCommand($query)->queryRow()['total'];
			if($count_result > 0){
				$data['status'] = 'ANIMAL_OBJECT_ALREADY_EXISTS';
			}
			else{
				$query = "SELECT animals.animal_id as animal_id FROM animals WHERE animals.animal_id = '".$options['animal_id']."'";
				$count_result = Yii::app()->db->createCommand($query)->queryRow()['animal_id'];
				if($count_result){
					// they were free to insert animals_objects
					if($temp == 0)
						$table = "animals_objects";
					elseif($temp == 1)
						$table = "animals_objects_temp";
				
					$query = "INSERT INTO $table (object_id, animal_id, buyer_id, end_time, 
					comment, object_name, pay_method, paymentid, language) values 
					('".$options['object_id']."', '".$options['animal_id']."', '".$options['buyer_id']."',
					'".$valid_upto."', '".$options['comment']."', '".$options['object_name']."', 
					'".$payment_method."', '".$payment_id."', '".$current_language."')";
					
					if(Yii::app()->db->createCommand($query)->execute()){
						$data['status']= "ANIMAL_OBJECT_ADD_SUCCESS";
						$data['object_id'] = Yii::app()->db->getLastInsertID();

						try{
							$sendfrom = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM']);
							$sendto = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO']);
							$result = $this->MailContent('NEW_OBJECT', 
							array('id'=>$options['animal_id'], 'object_name'=>$options['object_name'], 
							'valid_upto'=>$valid_upto, 'comment'=>$options['comment'], 'grave_type'=>'animal'));
					
							$message  = wordwrap(trim($result['message']), 100);			
							$headers  = 'MIME-Version: 1.0' . "\r\n";
							$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
							$headers .= 'From: '.$sendfrom. "\r\n";

							//TO-DO = Comment out for live server
							//@mail($sendto, $result['subject'], $message, $headers);
						}
						catch(Exception $e){
							$data['status'] = 'ANIMAL_OBJECT_ADD_ERROR';
						}
					}
					else{
						$data['status'] = 'ANIMAL_OBJECT_ADD_ERROR';
					}
				}
				else{
					$data['status'] = 'ANIMAL_NOT_EXISTS';
				}
			}

			return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['payment_method']
			$options['user_id']
			$options['buyer_id']
			$options['payment_id']
			$options['temp']
			$options['current_language']
			$options['valid_upto']
			$options['comment']
			$options['object_name']
			$options['object_id']
		***/

		private function addPersonObject($options = NULL){
			$payment_method = isset($options['payment_method']) ? $options['payment_method'] : -1; 
			$payment_id = isset($options['payment_id']) ? $options['payment_id'] : 0;
			$temp = isset($options['temp']) ? $options['temp'] : 0;
			$current_language = isset($options['current_language']) ? $options['current_language'] : 'en';
			$valid_upto = date("Y-m-d", strtotime($options['valid_upto']));
			$data = array();

			$query = "select count(*) as total from users_objects where user_id='".$options['user_id']."' and object_name='".$options['object_name']."' 
						and comment='".$options['comment']."' and DATE_ADD(add_date,INTERVAL 1 MINUTE)>now() ";
			$count_result = Yii::app()->db->createCommand($query)->queryRow()['total'];
			if($count_result > 0){
				$data['status'] = 'PERSON_OBJECT_ALREADY_EXISTS';
			}
			else{
				if($temp == 0)
					$table = "users_objects";
				else if($temp == 1)
					$table = "users_objects_temp";

				$query="insert into $table (object_id,user_id, buyer_id,end_time,comment,object_name, pay_method,
				paymentid, language) values ('".$options['object_id']."', '".$options['user_id']."', '".
				$options['buyer_id']."', '".$valid_upto."', '".$options['comment']."', 
				'".$options['object_name']."', '".$payment_method."','".$payment_id."', '".$current_language."')";

				if(Yii::app()->db->createCommand($query)->execute()){
					$data['status']= "PERSON_OBJECT_ADD_SUCCESS";
					$data['object_id'] = Yii::app()->db->getLastInsertID();
					
					try{
						$sendfrom = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM']);
						$sendto = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO']);
						$result = $this->MailContent('NEW_OBJECT', array('id'=>$options['user_id'], 
						'object_name'=>$options['object_name'], 'grave_type'=>'person',
						'valid_upto'=>$valid_upto, 'comment'=>$options['comment']));
				
						$message  = wordwrap(trim($result['message']), 100);			
						$headers  = 'MIME-Version: 1.0' . "\r\n";
						$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
						$headers .= 'From: '.$sendfrom. "\r\n";
		
						//TO-DO = Comment out for live server
						//@mail($sendto, $result['subject'], $message, $headers);
					}
					catch(Exception $e){
						$data['status']= "PERSON_OBJECT_ADD_ERROR";
					}
				}
				else{
					$data['status']= "PERSON_OBJECT_ADD_ERROR";
				}
			}
			return $data;
		}
		
		/***
			REQUIRED PARAMETERS
			-------------------
			$options['place_id']
			$options['family_name']
			$options['grave_image']
			$options['graves'] = collection of added graves array('grave_id', 'grave_image')
		*/

		private function addMultigrave($options = NULL){
			$place_id = isset($options['place_id']) ? $options['place_id'] : 2;
			$family_name = $options['family_name'];
			$grave_image = $options["grave_image"];
			$graves = explode(',', $options['graves']);
			$nextMultigraveId = 0;
			$data = array();

			$query="select max(multigrave_id) as m from multi_graves";	
			$row = Yii::app()->db->createCommand($query)->queryRow();
			
			if($row['m'] == 0 || $row['m'] == "")
				$nextMultigraveId = 1;
			else
				$nextMultigraveId = $row['m'] + 1;

			for($i=0; $i <= count($graves)-1; $i++){
				$query = "insert into multi_graves (multigrave_id, grave_id, grave_image, family_name, places )values(
					$nextMultigraveId, '".$graves[$i]."', '".$grave_image."', '".$family_name."', '".$place_id."')";    
				Yii::app()->db->createCommand($query)->execute();
			}
			
			$data['status'] = 'MULTI_GRAVE_ADDED';
			$data['multigrave_id'] = $nextMultigraveId;
			return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['temp']
			$options['religion_id']
			$options['religion_name']
			$options['payment_method']
			$options['payment_id']
			$options['amount']
			$options['current_language']
			$options['date_birth']
			$options['date_death']
			$options['buyer_id']
			$options['place_id'] // 1=grob(graveyard) AND 3=katak(catacomb) AND 4=Other
			$options['grave_id'] // 1=single AND 2=family(2 person) AND 3=communal(more than 2) || 1=catacomb
			$options['name']
			$options['surname']
			$options['gender']
			$options['grave_image']

			$options['bio_title']
			$options['bio_body']

			$options['unique_id']
		***/

		private function addPerson($options = NULL){
			$temp = isset($options['temp']) ? $options['temp'] : 0;
			$table = ($temp == 0) ? "users" : "users_temp";
			$graveyard_id = $this->getGraveyardIdByReligionId($options['religion_id']);
			$payment_method = isset($options['payment_method']) ? $options['payment_method'] : -1; 
			$payment_id = isset($options['payment_id']) ? $options['payment_id'] : 0;
			$current_language = isset($options['current_language']) ? $options['current_language'] : 'en';
			$today_date = date('Y-m-d');

			$date_birth = null;
			$date_death = null;

			if(isset($options['date_birth'])){
				$_dateb_y = substr($options['date_birth'], 0,4);
				$_dateb_m = substr($options['date_birth'], 5,7);
				$_dateb_d = substr($options['date_birth'], 8,10);
				$date_birth = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
			}

			if(isset($options['date_death'])){
				$_dateb_y = substr($options['date_death'], 0,4);
				$_dateb_m = substr($options['date_death'], 5,7);
				$_dateb_d = substr($options['date_death'], 8,10);
				$date_death = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
			}

			$data = array();

			$query="insert into $table ( buyer_id, place_id, grave_id, graveyard_id, 
								name1, surname, date_birth, date_death, gender, 
								religion_name, religion_id, grave_image, 
								pay_method, amount, paymentid, language, flash_data, 
								add_date, is_deleted ) values (
								'".$options['buyer_id']."', '".$options['place_id']."', '".$options['grave_id']."', '".$graveyard_id."', 
								'".$options['name']."', '".$options['surname']."', '".$date_birth."', '".$date_death."', '".$options['gender']."',
								'".$options['religion_name']."', '".$options['religion_id']."',  '".$options['grave_image']."', 
								'".$payment_method."', '".$options['amount']."', '".$payment_id."', '".$current_language."', '', 
								'".$today_date."', 0)";
			
			if(Yii::app()->db->createCommand($query)->execute()){
				$user_id = Yii::app()->db->getLastInsertID();
				if($user_id){
					$query="insert into biography(user_id, order_num, title, body)  values ( $user_id, 0 , '".$options['bio_title']."','".$options['bio_body']."')";
					
					if(Yii::app()->db->createCommand($query)->execute()){
						$query = "SELECT * FROM users_photos_temp WHERE uniq_id = '".$options['unique_id']."'";
						$result = Yii::app()->db->createCommand($query)->queryAll();
						foreach($result as $row){
							$query = "insert into users_photos (user_id, file_name, is_portrait) values ('".$user_id."','".$row['file_name']."','".$row['is_portrait']."')";
							Yii::app()->db->createCommand($query)->execute();
						}
						$data['status']= "PERSON_ADD_SUCCESS";
						$data['user_id']= $user_id;
						$data['grave_image']= $options['grave_image'];

						/*
						TODO MAIL LOGIN WHEN ADD PERSON GRAVE
						$sendfrom = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM']);
						$sendto = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO']);
						$result = $this->MailContent('NEW_OBJECT', array('id'=>$options['user_id'], 
						'object_name'=>$options['object_name'], 'grave_type'=>'person',
						'valid_upto'=>$valid_upto, 'comment'=>$options['comment']));
				
						$message  = wordwrap(trim($result['message']), 100);			
						$headers  = 'MIME-Version: 1.0' . "\r\n";
						$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
						$headers .= 'From: '.$sendfrom. "\r\n";
						*/
						//TO-DO = Comment out for live server
						//@mail($sendto, $result['subject'], $message, $headers);
	
					}
					else{
						$data['status']= "PERSON_ADD_ERROR";
					}
				}
				else{
					$data['status']= "PERSON_ADD_ERROR";
				}
			}
			else{
				$data['status']= "PERSON_ADD_ERROR";
			}
			return $data;
		}
		
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['temp']
			$options['payment_method']
			$options['payment_id']
			$options['amount']
			$options['current_language']
			$options['date_birth']
			$options['date_death']
			$options['buyer_id']
			$options['al_id']
			$options['gender']
			$options['animalkind']
			$options['name']
			$options['owner_name']
			$options['owner_surname']
			$options['grave_image']
			$options['grave_id']
			$options['image_url']
			$options['live_history']
			$options['live_history_signature']
			$options['unique_id']
		***/

		private function addAnimal($options = NULL){
			$temp = isset($options['temp']) ? $options['temp'] : 0;
			$table = ($temp == 0) ? "animals" : "animals_temp";
			$payment_method = isset($options['payment_method']) ? $options['payment_method'] : -1; 
			$payment_id = isset($options['payment_id']) ? $options['payment_id'] : 0;
			$current_language = isset($options['current_language']) ? $options['current_language'] : 'en';
			$today_date = date('Y-m-d');

			$date_birth = null;
			$date_death = null;

			if(isset($options['date_birth'])){
				$_dateb_y = substr($options['date_birth'], 0,4);
				$_dateb_m = substr($options['date_birth'], 5,7);
				$_dateb_d = substr($options['date_birth'], 8,10);
				$date_birth = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
			}
			
			if(isset($options['date_death'])){
				$_dateb_y = substr($options['date_death'], 0,4);
				$_dateb_m = substr($options['date_death'], 5,7);
				$_dateb_d = substr($options['date_death'], 8,10);
				$date_birth = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
			}

			$data = array();

			$query="insert into $table ( buyer_id, al_id, gender, animalkind, 
										name, owner_name, owner_surname, date_birth, date_death, 
										grave_image, image_url, is_deleted, grave_id, 
										pay_method, amount, paymentid, language, add_date, 
										live_history, live_history_signature ) values (
								'".$options['buyer_id']."', '".$options['al_id']."', '".$options['gender']."', '".$options['animalkind']."', 
								'".$options['name']."', '".$options['owner_name']."', '".$options['owner_surname']."', '".$date_birth."', '".$date_death."', 
								'".$options['grave_image']."', '".$options['image_url']."',  0, '".$options['grave_id']."',
								'".$payment_method."', '".$options['amount']."', '".$payment_id."', '".$current_language."', '".$today_date."',
								'".$options['live_history']."', '".$options['live_history_signature']."')";
			
			if(Yii::app()->db->createCommand($query)->execute()){
				$animal_id = Yii::app()->db->getLastInsertID();
				if($animal_id){
					$query = "SELECT * FROM animals_photos_temp WHERE uniq_id = '".$options['unique_id']."'";
					$result = Yii::app()->db->createCommand($query)->queryAll();
					foreach($result as $row){
						$query = "insert into animals_photos (animal_id, file_name, is_portrait) values 
						('".$animal_id."','".$row['file_name']."','".$row['is_portrait']."')";
						Yii::app()->db->createCommand($query)->execute();
					}

					$data['status']= "ANIMAL_ADD_SUCCESS";
					$data['animal_id']= $animal_id;

					/*
					TODO MAIL LOGIN WHEN ADD ANIMAL GRAVE
					$sendfrom = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_FROM']);
					$sendto = trim(ApiController::PAYMENT_CONFIG['ADMIN_EMAIL_TO']);
					$result = $this->MailContent('NEW_OBJECT', array('id'=>$options['user_id'], 
					'object_name'=>$options['object_name'], 'grave_type'=>'person',
					'valid_upto'=>$valid_upto, 'comment'=>$options['comment']));
			
					$message  = wordwrap(trim($result['message']), 100);			
					$headers  = 'MIME-Version: 1.0' . "\r\n";
					$headers .= 'Content-type: text/html; charset=iso-8859-2' . "\r\n";
					$headers .= 'From: '.$sendfrom. "\r\n";
					*/
					//TO-DO = Comment out for live server
					//@mail($sendto, $result['subject'], $message, $headers);
				}
				else{
					$data['status']= "ANIMAL_ADD_ERROR";
				}
			}
			else{
				$data['status']= "ANIMAL_ADD_ERROR";
			}
			return $data;
		}
		

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['unique_id']
			$options['is_portrait']


		***/

		private function addPersonTemporaryPhoto($options = NULL, $files = NULL){
			$clientImageFolderPath = $this->getClientImageFolderPath();
			$data = array();
			$is_portrait = isset($options['is_portrait']) ? 1 : 0 ;
			$unique_id = $options['unique_id'];
			$large_path =  $clientImageFolderPath."zdjecia/large/";
			$thumb_path =  $clientImageFolderPath."zdjecia/thumb/";
			$prefix = "user_";
			$filename = $prefix.md5(uniqid(rand(), true)).".jpg";
			$tmp_name = $_FILES["file"]["tmp_name"];
			$query="insert into users_photos_temp (uniq_id, file_name, is_portrait) values ('$unique_id','$filename',$is_portrait)";
			$result = Yii::app()->db->createCommand($query)->execute();
			$result = true;
			if($result){
				if($is_portrait){
					$this->cyberResizeImage($tmp_name, 200, 265, $thumb_path.$filename);
				}
				else{
					$this->cyberResizeImage($tmp_name, 170, 130, $thumb_path.$filename);
				}

				$this->cyberResizeImage($tmp_name, 640, 480, $large_path.$filename);
				
				$data['status'] = 'SUCCESS';
			}
			else{
				$data['status'] = 'ERROR';
			}
			return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['unique_id']
			$options['is_portrait']


		***/

		private function addAnimalTemporaryPhoto($options = NULL){
			$clientImageFolderPath = $this->getClientImageFolderPath();
			$data = array();
			$is_portrait = isset($options['is_portrait']) ? 1 : 0 ;
			$unique_id = $options['unique_id'];
			$large_path =  $clientImageFolderPath."zdjecia/large/";
			$thumb_path =  $clientImageFolderPath."zdjecia/thumb/";
			$prefix = "animal_";
			$filename = $prefix.md5(uniqid(rand(), true)).".jpg";
			$tmp_name = $_FILES["file"]["tmp_name"];
			$query="insert into animals_photos_temp (uniq_id, file_name, is_portrait) values ('$unique_id','$filename',$is_portrait)";
			$result = Yii::app()->db->createCommand($query)->execute();
			if($result){
				if($is_portrait){
					$this->cyberResizeImage($tmp_name, 200, 265, $thumb_path.$filename);
				}
				else{
					$this->cyberResizeImage($tmp_name, 170, 130, $thumb_path.$filename);
				}
				
				$this->cyberResizeImage($tmp_name, 640, 480, $large_path.$filename);
				
				$data['status'] = 'SUCCESS';
			}
			else{
				$data['status'] = 'ERROR';
			}
			return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['unique_id']
			$options['file_name']
		***/

		private function deletePersonTemporaryPhoto($options = NULL){
			$clientImageFolderPath = $this->getClientImageFolderPath();
			$query="delete from users_photos_temp where uniq_id='".$options['uniq_id']."' and file_name='".$options['file_name']."'";
			$result = Yii::app()->db->createCommand($query)->execute();
			$large_path =  $clientImageFolderPath."zdjecia/large/";
			$thumb_path =  $clientImageFolderPath."zdjecia/thumb/";
			$data = array();
			if($result){
				@unlink($large_path.$options['file_name']);
				@unlink($thumb_path.$options['file_name']);
				$data['status'] = 'SUCCESS';
			}
			else{
				$data['status'] = 'ERROR';
			}
			return $data;
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['unique_id']
			$options['file_name']
		***/

		private function deleteAnimalTemporaryPhoto($options = NULL){
			$query="delete from animals_photos_temp where uniq_id='".$options['uniq_id']."' and file_name='".$options['file_name']."'";
			$result = Yii::app()->db->createCommand($query)->execute();
			$large_path =  $clientImageFolderPath."zdjecia/large/";
			$thumb_path =  $clientImageFolderPath."zdjecia/thumb/";
			$data = array();
			if($result){
				@unlink($large_path.$options['file_name']);
				@unlink($thumb_path.$options['file_name']);
				$data['status'] = 'SUCCESS';
			}
			else{
				$data['status'] = 'ERROR';
			}
			return $data;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['id'] = user_id

		***/

		private function getPerson($options = NULL){
			if(!isset($options['name']) && 
				!isset($options['surname']) && 
				!isset($options['date_birth']) && 
				!isset($options['date_death']) && 
				!isset($options['id']))
				return -1;
				
			if(isset($options['id'])) {
				$query="select * from users where user_id=".$options['id'];	
				$person = Yii::app()->db->createCommand($query)->queryRow();
				if($person) {
					$person['name1']=explode("|",$person['name1']);
					$person['ex_wife1']=explode("|",$person['ex_wife1']);
					$person['childrens_names']=explode("|",$person['childrens_names']);
				
					return $person;
				}
				else
					return -2;
			}
			
			//current format: dd-mm-yyyy
			$d1=explode('-',$options['date_birth']);
			$d2=explode('-',$options['date_death']);

			if ($d1[0] == "00") {
				$d1[0]='01';//the first day
			}
			if ($d1[1] == "00") {
				$d1[1]='01';//month of January
			}
			if ($d2[0] == "00") {
				$d2[0]='01';//the first day
			}
			if ($d2[1] == "00") {
				$d2[1]='01';//month of January
			}

			if(isset($options['date_birth'])){
				$_dateb_y = substr($options['date_birth'], 0,4);
				$_dateb_m = substr($options['date_birth'], 5,7);
				$_dateb_d = substr($options['date_birth'], 8,10);
				$date_birth = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
			}
			
			if(isset($options['date_death'])){
				$_dateb_y = substr($options['date_death'], 0,4);
				$_dateb_m = substr($options['date_death'], 5,7);
				$_dateb_d = substr($options['date_death'], 8,10);
				$date_birth = $_dateb_y."-".$_dateb_m."-".$_dateb_d;
			}

	
			if($date_death!='0000-00-00' && $date_death!='00-00-0000' && $date_death!='' && $date_death!='-00-00')
			{    
				if (count($d2)!=3 || !checkdate($d2[1], $d2[0], $d2[2])) 
					return -4;
					
				if(($this->dateToDays($d2[0], $d2[1], $d2[2]) - $this->dateToDays($d1[0], $d1[1], $d1[2])) < 0)
					return -5;
					
				if(($this->dateToDays(date("d"), date("m"), date("Y")) - $this->dateToDays($d2[0], $d2[1], $d2[2])) < 0)
					return -6;
			}
			
			$query="select * from users where 1";
			
			if(isset($options['name'])) $query.=" and name1 like '%".$options['name']."%'";
			if(isset($options['surname'])) $query.=" and surname like '%".$options['surname']."%'";
			if(isset($options['date_birth'])) $query.=" and date_birth='".$options['date_birth']."'";
			if(isset($options['date_death']) && $date_death!='0000-00-00') $query.=" and date_death='".$options['date_death']."'";	
			
			$person = Yii::app()->db->createCommand($query)->queryRow();

			if($person) {
				$person['name1']=explode("|",$person['name1']);
				$person['ex_wife1']=explode("|",$person['ex_wife1']);
				$person['childrens_names']=explode("|",$person['childrens_names']);
				return $person;
			}
			else
				return -7;
		}
		
		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['id'] = buyer_id

		***/

		private function getTombs($options = NULL){
			$data = array();
			$query = "select mg2.grave_id,
						u.name1,
						u.surname,
						mg2.multigrave_id,
						DATE_FORMAT(u.date_death,'%d-%m-%Y') as date_death,
						mg2.family_name,
						mg2.grave_image,
						mg2.places
				from multi_graves mg2, uers u 
				where mg2.grave_id=u.user_id and u.buyer_id=".$options['id']."";
			//echo($sql);
			$result = Yii::app()->db->createCommand($query)->queryAll();

			$tmp = array();
			foreach($result as $row) {
				$tmp[$row['multigrave_id']][] = $row; 
			} 

			foreach($tmp as $v)
				$data[]=$v;
				
			return $data; 
		}

		/***
		 	REQUIRED PARAMETERS
			--------------------
			$options['type']

		***/
		private function getPrices($options = NULL){
			$query="select * from price_master where type='".$options['type']."'";	
			$result = Yii::app()->db->createCommand($query)->queryAll();
			$data = array();

			foreach($result as $row){
				$data[] = $row;
			}

            return $data;
		}

		private function getTodayDate(){
			$data = array();
			$data['today_date'] = date('Y-m-d');
			return $data;
		}

		private function dateToDays($day, $month, $year)
		{
			$century = (int)substr($year, 0, 2);
			$year = (int)substr($year, 2, 2);
			if ($month > 2) {
				$month -= 3;
			} else {
				$month += 9;
				if ($year) {
					$year--;
				} else {
					$year = 99;
					$century --;
				}
			}
	
			return (floor((146097 * $century) / 4 ) +
					floor((1461 * $year) / 4 ) +
					floor((153 * $month + 2) / 5 ) +
					$day + 1721119);
		}

        private function MailContent($method, $parameters){
			$result = array();
			$content = null;

            switch($method){
                case 'NEW_COMMENT': 
						$result['subject'] = "Dodano komentarz - Informacja dla administratora";
						$content = "<strong>Informacja dla administratora</strong><br /><br />";
						$content .= "Dodano komentarz do grobu <br />";
						if ($parameters['grave_type'] == 'animal')
							$content .= "zwierz�cia ANIMAL_ID: ".$parameters['id']." <a href=\"http://www.wirtualnycmentarz.pl/index.php?id_a=".$parameters['id']."\" target=\"_blank\">http://".ApiController::CONFIG['HOST_ADDRESS']."/index.php?id_a=".$parameters['id']."</a>.";
						else if($parameters['grave_type'] == 'animal')
							$content .= "osoby PERSON_ID: ".$parameters['id']." <a href=\"http://www.wirtualnycmentarz.pl/index.php?id=".$parameters['id']."\" target=\"_blank\">http://".ApiController::CONFIG['HOST_ADDRESS']."/index.php?id=".$parameters['id']."</a>.";

						$content .= "<br><br>";
						$content .= "Podpis pod komentarzem: <strong>".$parameters['nick']."</strong><br><br>";
						$content .= "Tre�� komentarza: <strong>".$parameters['body']."</strong><br><br>";
						
						$result['message'] = $content;
					break;
				case 'RESET_PASSWORD':
						$result['subject'] = "Resetowanie hasla w wirtualnym cmentarzu";

						$content = "We received a request to reset the password for ";
						$content .= "the account with the login ".$parameters['username']." at www.wirtualnycmentarz.pl. <br/><br/>";
						$content .= "The new password is: ".$parameters['password']." <br/><br/>We check, <br/>Building the cemetery.";
						$result['message'] = $content;
					break;
				case 'PAYMENT_USER_MAIL':
						$result['subject'] =  "Wirtualnycmentarz.pl - Informacja o p�atno�ci przelewem";
						$content  = "Dokona�e� zakupu us�ugi w naszym serwisie.<br />";
						$content  .= "Wybra�e� metod� p�atno�ci: <strong>przelew</strong><br />";
						$content  .= "<br />";
						$content  .= "Data zam�wienia us�ugi: <strong>".date("j-n-Y")."</strong>.<br />";
						$content  .= "Prosz� dokonac przelewu kwoty: <strong>".$parameters['amount']."</strong> z�.<br />";
						$content  .= "<br />";
						$content  .= "Czas oczekiwania na przelew to 3 dni.<br />";
						$content  .= "Po up�ywie tego okresu dane zarejestrowane  w systemie z tej operacji zostana usuni�te. W przypadku pyta� prosz� o kontakt z administratorem.<br />";
						$content  .= "<hr>";
						$content  .= "Prosz� dokona� przelewu na konto:<br />";
						$content  .= "<strong>".$parameters['account_number']."</strong><br /><br />";
						$content  .= "Dane w�a�ciciela konta:<br />";
						$content  .= "<strong>".$parameters['address_data']."</strong><br />";
						$content  .= "W tytule wp�aty prosimy poda�:<br /><br />";
						$content  .= "<strong>ID ".$parameters['id']."</strong><br>";
						$content  .= "<hr>";
						$content  .= "";
						$content  .= "Dzi�kujemy za wsp�prac�<br>";
						$content  .= "Administracja Wirtualnego Cmentarza";
						$result['message'] = $content;
				case 'PAYMENT_ADMIN_MAIL':
						$result['subject']  = "Wirtualnycmentarz.pl - Informacja dla administratora o p�atno�ci przelewem";

						// ==== tresc listu =======
						$content  = "U�ytkownik ".$parameters['login']." (ID ".$parameters['buyer_id']."), <strong>".$parameters['name']." ".$parameters['surname']."</strong> ";
						$content .= "wybra� p�atno�� przelewem.<br />";
						$content .= "<br />";
						$content .= "Kwota do zap�aty: <strong>".$parameters['amount']." z�</strong>.<br />";
						$content .= "Data zam�wienia: <strong>".date("j-n-Y")."</strong>.<br />";
						$content .= "Po up�ywie 3 dni zam�wienie powinno by� anulowane.<br />";
						$content .= "<hr>";
						$content .= "Dane obiektu:<br />";
						
						//id = user_id or animal_id
						$content .= "<strong>ID pochowanej osoby: ".$parameters['id']."</strong><br>";

						if (isset($parameters['pay_description'])) 
							$content .= "<strong>Tytu� p�atno�ci: ".$parameters['pay_description']."</strong><br>";

						$content .= "<strong></strong><br>";
						$content .= "<hr>";
						$content .= "";
						
						$result['message'] = $content;
				
				case 'NEW_OBJECT':
						$host_address = "www.wirtualnycmentarz.pl";

						$content = "<strong>Informacja dla administratora</strong><br /><br />";
						$content .= "Dodano obiekt do grobu <br />";
						if ($parameters['grave_type'] == 'animal') {
							$content .= "zwierz�cia ANIMAL_ID: ".$parameters['id']." <a href=\"http://www.wirtualnycmentarz.pl/index.php?id_a=".$parameters['id']."\" target=\"_blank\">http://".$host_address."/index.php?id_a=".$parameters['id']."</a>.";
						} else {
							$content .= "osoby PERSON_ID: ".$parameters['id']." <a href=\"http://www.wirtualnycmentarz.pl/index.php?id=".$parameters['id']."\" target=\"_blank\">http://".$host_address."/index.php?id=".$parameters['id']."</a>.";
						}
						$content .= "<br><br>";
						$content .= "Rodzaj obiektu: <strong>".$parameters['object_name']."</strong><br><br>";
						$content .= "Termin: <strong>".$parameters['valid_upto']."</strong><br><br>";
						$content .= "Tre�� podpisu: <strong>".$parameters['comment']."</strong><br><br>";
						
						$subject = "Dodano obiekt (".$parameters['object_name'].") - Informacja dla administratora";
						
						$result['message'] = $content;
						$result['subject'] = $subject;
				default:
                    break;
            }
            return $result;
		}
		
		private function getClientImageFolderPath(){
			return dirname(getcwd())."/client/dist/assets/images/";
		}

		private function cyberResizeImage($source, $max_x, $max_y, $save_image, $jpeg_quality = 95) {
			/*
			 * source - obrazek jpeg
			 * max_x - maksymalna szerokosc pomniejszonego obrazka
			 * max_y - maksymalna dlugosc pomniejszonego obrazka
			 * save_image - nazwa pliku do ktorego zostanie zapisany nowy obrazek
			 * jpeg_quality - jakosc powstalego obrazu jpeg - jezeli bedzie inny to argument jest nie wazny (domyslnie 100)
			 * je�eli jakis wymiar obrazka jest mniejszt ni� docelowe wymiart to dodawane jest obramowanie
			 * z g�ry/do�u i/lub lewej/prawej obecnie ustawione na lolor bia�t ( 255,255,255))
			 */
	   
			   if(@exif_imagetype($source) == IMAGETYPE_JPEG)
			   {
				  $img_src = imagecreatefromjpeg($source);
			   }
			   elseif(@exif_imagetype($source) == IMAGETYPE_GIF)
			   {
				  $img_src = imagecreatefromgif($source);
			   }
			   elseif(@exif_imagetype($source) == IMAGETYPE_PNG)
			   {
				  $img_src = imagecreatefrompng($source);
			   }
			   else
			   {
				  return false;
			   }
	   
			$image_x = imagesx($img_src);
			$image_y = imagesy($img_src);
				 if ( ($image_x > $max_x) OR ($image_y > $max_y) )
				 {
					 $ratio_x = $max_x/$image_x;
					 if (($ratio_x*$image_y)<$max_y)
					 {
						 $ratio_y = $ratio_x;
					 }
					 else
					 {
						 $ratio_y = $max_y/$image_y;
						 $ratio_x = $ratio_y;
					 }
				 }
				 else
				 {
					 $ratio_x = $ratio_y = 1;
				 }
				 $new_x = $image_x*$ratio_x;
				 $new_y = $image_y*$ratio_y;
				 $move_x = ($max_x - $new_x )/2;
				 $move_y = ($max_y - $new_y )/2;
	   
			   $new_img = imagecreatetruecolor($max_x, $max_y);
			   $background = imagecolorallocate($new_img, 0, 0, 0);
			   imagefill($new_img, 0, 0, $background);
			   imagecopyresampled($new_img, $img_src, $move_x, $move_y, 0, 0, $new_x, $new_y, $image_x, $image_y);
			   if(exif_imagetype($source) == IMAGETYPE_JPEG)
			   {
				  imagejpeg($new_img, $save_image, $jpeg_quality);
			   }
			   elseif(exif_imagetype($source) == IMAGETYPE_GIF)
			   {
				  imagegif($new_img, $save_image);
			   }
			   elseif(exif_imagetype($source) == IMAGETYPE_PNG)
			   {
				  imagepng($new_img, $save_image);
			   }
			   return true;
		}

		private function getGraveyardIdByReligionId( $religion_id ){
			$graveyard_id = 0;
			if($religion_id == 4 || $religion_id == 5 || $religion_id == 8 || 
			$religion_id == 9 || $religion_id == 11) $graveyard_id = 1;
			elseif($religion_id == 14) $graveyard_id = 2;
			elseif($religion_id == 6) $graveyard_id = 3;
			elseif($religion_id == 15 || $religion_id == 16) $graveyard_id = 4;
			elseif($religion_id == 1 || $religion_id == 12) $graveyard_id = 5;
			elseif($religion_id == 2) $graveyard_id = 6;
			elseif($religion_id == 10) $graveyard_id = 7;
			elseif($religion_id == 3) $graveyard_id = 8;
			elseif($religion_id == 7) $graveyard_id = 9;
			elseif($religion_id == 13 || $religion_id == 18) $graveyard_id = 10;
			elseif($religion_id == 17) $graveyard_id = 11;
			return $graveyard_id;
		}
	}
?>