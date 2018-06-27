<?php

/**
 * This is the model class for table "users".
 *
 * The followings are the available columns in table 'users':
 * @property integer $user_id
 * @property integer $sex_id
 * @property integer $skin_id
 * @property integer $buyer_id
 * @property integer $grave_id
 * @property integer $country_id
 * @property integer $country_d_id
 * @property integer $profession_id
 * @property integer $religion_id
 * @property string $religion_name
 * @property integer $graveyard_id
 * @property integer $place_id
 * @property string $name1
 * @property string $name2
 * @property string $name3
 * @property string $surname
 * @property string $surname_desc
 * @property string $surname_other
 * @property integer $gender
 * @property string $ex_wife1
 * @property string $ex_wife2
 * @property string $ex_wife3
 * @property string $maiden_name
 * @property string $nickname
 * @property string $father_name
 * @property string $mother_name
 * @property string $childrens_names
 * @property string $date_birth
 * @property string $place_birth
 * @property string $cityname_now
 * @property string $cityname_history
 * @property string $date_death
 * @property string $place_death
 * @property string $death_reason
 * @property string $cityname_death_now
 * @property string $cityname_death_history
 * @property string $crest
 * @property string $crest_url
 * @property string $other_professions
 * @property string $functions
 * @property string $live_history
 * @property integer $father_id
 * @property integer $mother_id
 * @property string $hobby
 * @property string $pic_url
 * @property integer $is_deleted
 * @property string $c_birth
 * @property string $c_death
 * @property string $country_birth
 * @property string $country_death
 * @property string $grave_image
 * @property integer $hobbyids
 * @property string $flash_data
 * @property string $uniq_id
 * @property string $pay_method
 * @property integer $paymentid
 * @property string $amount
 * @property string $add_date
 * @property string $language
 */
class Users extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'users';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('flash_data, add_date', 'required'),
			array('sex_id, skin_id, buyer_id, grave_id, country_id, country_d_id, profession_id, religion_id, graveyard_id, place_id, gender, father_id, mother_id, is_deleted, hobbyids, paymentid', 'numerical', 'integerOnly'=>true),
			array('religion_name, name2, name3, surname, surname_desc, surname_other, ex_wife2, ex_wife3, maiden_name, nickname, father_name, mother_name, place_birth, cityname_now, cityname_history, place_death, death_reason, crest, crest_url, pic_url, country_birth, country_death, grave_image', 'length', 'max'=>200),
			array('cityname_death_now, cityname_death_history', 'length', 'max'=>250),
			array('c_birth, c_death, language', 'length', 'max'=>2),
			array('uniq_id', 'length', 'max'=>128),
			array('pay_method, amount', 'length', 'max'=>16),
			array('visibility', 'length', 'max'=>3),
			array('name1, ex_wife1, childrens_names, date_birth, date_death, other_professions, functions, live_history, hobby', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('user_id, sex_id, skin_id, buyer_id, grave_id, country_id, country_d_id, profession_id, religion_id, religion_name, graveyard_id, place_id, name1, name2, name3, surname, surname_desc, surname_other, gender, ex_wife1, ex_wife2, ex_wife3, maiden_name, nickname, father_name, mother_name, childrens_names, date_birth, place_birth, cityname_now, cityname_history, date_death, place_death, death_reason, cityname_death_now, cityname_death_history, crest, crest_url, other_professions, functions, live_history, father_id, mother_id, hobby, pic_url, is_deleted, c_birth, c_death, country_birth, country_death, grave_image, hobbyids, flash_data, uniq_id, pay_method, paymentid, amount, add_date, language', 'safe', 'on'=>'search'),
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
			'visibility' => 'Visibility',
			'sex_id' => 'Sex',
			'skin_id' => 'Skin',
			'buyer_id' => 'Buyer',
			'grave_id' => 'Grave',
			'country_id' => 'Country',
			'country_d_id' => 'Country D',
			'profession_id' => 'Profession',
			'religion_id' => 'Religion',
			'religion_name' => 'Religion Name',
			'graveyard_id' => 'Graveyard',
			'place_id' => 'Place',
			'name1' => 'Name1',
			'name2' => 'Name2',
			'name3' => 'Name3',
			'surname' => 'Surname',
			'surname_desc' => 'Surname Desc',
			'surname_other' => 'Surname Other',
			'gender' => 'Gender',
			'ex_wife1' => 'Ex Wife1',
			'ex_wife2' => 'Ex Wife2',
			'ex_wife3' => 'Ex Wife3',
			'maiden_name' => 'Maiden Name',
			'nickname' => 'Nickname',
			'father_name' => 'Father Name',
			'mother_name' => 'Mother Name',
			'childrens_names' => 'Childrens Names',
			'date_birth' => 'Date Birth',
			'place_birth' => 'Place Birth',
			'cityname_now' => 'Cityname Now',
			'cityname_history' => 'Cityname History',
			'date_death' => 'Date Death',
			'place_death' => 'Place Death',
			'death_reason' => 'Death Reason',
			'cityname_death_now' => 'Cityname Death Now',
			'cityname_death_history' => 'Cityname Death History',
			'crest' => 'Crest',
			'crest_url' => 'Crest Url',
			'other_professions' => 'Other Professions',
			'functions' => 'Functions',
			'live_history' => 'Live History',
			'father_id' => 'Father',
			'mother_id' => 'Mother',
			'hobby' => 'Hobby',
			'pic_url' => 'Pic Url',
			'is_deleted' => 'Is Deleted',
			'c_birth' => 'C Birth',
			'c_death' => 'C Death',
			'country_birth' => 'Country Birth',
			'country_death' => 'Country Death',
			'grave_image' => 'Grave Image',
			'hobbyids' => 'Hobbyids',
			'flash_data' => 'Flash Data',
			'uniq_id' => 'Uniq',
			'pay_method' => 'Pay Method',
			'paymentid' => 'Paymentid',
			'amount' => 'Amount',
			'add_date' => 'Add Date',
			'language' => 'Language',
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
		$criteria->compare('visibility',$this->visibility);
		$criteria->compare('sex_id',$this->sex_id);
		$criteria->compare('skin_id',$this->skin_id);
		$criteria->compare('buyer_id',$this->buyer_id);
		$criteria->compare('grave_id',$this->grave_id);
		$criteria->compare('country_id',$this->country_id);
		$criteria->compare('country_d_id',$this->country_d_id);
		$criteria->compare('profession_id',$this->profession_id);
		$criteria->compare('religion_id',$this->religion_id);
		$criteria->compare('religion_name',$this->religion_name,true);
		$criteria->compare('graveyard_id',$this->graveyard_id);
		$criteria->compare('place_id',$this->place_id);
		$criteria->compare('name1',$this->name1,true);
		$criteria->compare('name2',$this->name2,true);
		$criteria->compare('name3',$this->name3,true);
		$criteria->compare('surname',$this->surname,true);
		$criteria->compare('surname_desc',$this->surname_desc,true);
		$criteria->compare('surname_other',$this->surname_other,true);
		$criteria->compare('gender',$this->gender);
		$criteria->compare('ex_wife1',$this->ex_wife1,true);
		$criteria->compare('ex_wife2',$this->ex_wife2,true);
		$criteria->compare('ex_wife3',$this->ex_wife3,true);
		$criteria->compare('maiden_name',$this->maiden_name,true);
		$criteria->compare('nickname',$this->nickname,true);
		$criteria->compare('father_name',$this->father_name,true);
		$criteria->compare('mother_name',$this->mother_name,true);
		$criteria->compare('childrens_names',$this->childrens_names,true);
		$criteria->compare('date_birth',$this->date_birth,true);
		$criteria->compare('place_birth',$this->place_birth,true);
		$criteria->compare('cityname_now',$this->cityname_now,true);
		$criteria->compare('cityname_history',$this->cityname_history,true);
		$criteria->compare('date_death',$this->date_death,true);
		$criteria->compare('place_death',$this->place_death,true);
		$criteria->compare('death_reason',$this->death_reason,true);
		$criteria->compare('cityname_death_now',$this->cityname_death_now,true);
		$criteria->compare('cityname_death_history',$this->cityname_death_history,true);
		$criteria->compare('crest',$this->crest,true);
		$criteria->compare('crest_url',$this->crest_url,true);
		$criteria->compare('other_professions',$this->other_professions,true);
		$criteria->compare('functions',$this->functions,true);
		$criteria->compare('live_history',$this->live_history,true);
		$criteria->compare('father_id',$this->father_id);
		$criteria->compare('mother_id',$this->mother_id);
		$criteria->compare('hobby',$this->hobby,true);
		$criteria->compare('pic_url',$this->pic_url,true);
		$criteria->compare('is_deleted',$this->is_deleted);
		$criteria->compare('c_birth',$this->c_birth,true);
		$criteria->compare('c_death',$this->c_death,true);
		$criteria->compare('country_birth',$this->country_birth,true);
		$criteria->compare('country_death',$this->country_death,true);
		$criteria->compare('grave_image',$this->grave_image,true);
		$criteria->compare('hobbyids',$this->hobbyids);
		$criteria->compare('flash_data',$this->flash_data,true);
		$criteria->compare('uniq_id',$this->uniq_id,true);
		$criteria->compare('pay_method',$this->pay_method,true);
		$criteria->compare('paymentid',$this->paymentid);
		$criteria->compare('amount',$this->amount,true);
		$criteria->compare('add_date',$this->add_date,true);
		$criteria->compare('language',$this->language,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Users the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
