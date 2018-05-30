<?php

/**
 * This is the model class for table "users_auth".
 *
 * The followings are the available columns in table 'users_auth':
 * @property integer $user_id
 * @property integer $user_perm
 * @property string $user_name
 * @property string $user_lastname
 * @property string $user_nickname
 * @property string $user_password
 */
class UsersAuth extends CActiveRecord
{
	public $rememberMe, $_identity;
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'users_auth';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('user_perm', 'numerical', 'integerOnly'=>true),
			array('user_name, user_lastname, user_nickname', 'length', 'max'=>80),
			array('user_password', 'length', 'max'=>250),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('user_id, user_perm, user_name, user_lastname, user_nickname, user_password', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'user_id' => 'User',
			'user_perm' => 'User Perm',
			'user_name' => 'User Name',
			'user_lastname' => 'User Lastname',
			'user_nickname' => 'User Nickname',
			'user_password' => 'User Password',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('user_id',$this->user_id);
		$criteria->compare('user_perm',$this->user_perm);
		$criteria->compare('user_name',$this->user_name,true);
		$criteria->compare('user_lastname',$this->user_lastname,true);
		$criteria->compare('user_nickname',$this->user_nickname,true);
		$criteria->compare('user_password',$this->user_password,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return UsersAuth the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
	/**
	 * Authenticates the PASSWORD.
	 * This is the 'authenticate' validator as declared in rules().
	 */
	public function authenticate($attribute,$params)
	{
		if(!$this->hasErrors())
		{
			$this->_identity=new UserIdentity($this->user_name,$this->user_password);
			if(!$this->_identity->authenticate())
				$this->addError('PASSWORD','Incorrect USERNAME or PASSWORD.');
		}
	}

	/**
	 * Logs in the user using the given USERNAME and PASSWORD in the model.
	 * @return boolean whether login is successful
	 */
	public function login()
	{
		if($this->_identity===null)
		{	
			$this->_identity=new UserIdentity($this->user_name,$this->user_password);
			$this->_identity->errorCode = $this->_identity->authenticate();
		}
		if($this->_identity->errorCode===UserIdentity::ERROR_NONE)
		{
			$duration = 0;
			
			if($this->rememberMe == 1)
				$duration = 3600*24*30; // 30 days
			
			Yii::app()->user->login($this->_identity,$duration);
			
			return true;
		}
		else
			return false;
	}
	
	public function validateLoginInputs(){
		return isset($this->user_name) && isset($this->user_password);
	}
}
