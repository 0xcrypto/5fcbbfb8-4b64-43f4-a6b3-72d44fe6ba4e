<?php

/**
 * This is the model class for table "static_page".
 *
 * The followings are the available columns in table 'static_page':
 * @property integer $id
 * @property string $title_en
 * @property string $heading_en
 * @property string $body_en
 * @property string $body_pl
 * @property string $title_pl
 * @property string $heading_pl
 */
class StaticPage extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return StaticPage the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'static_page';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('title_en, heading_en, body_en, body_pl, title_pl, heading_pl', 'required'),
			array('title_en, heading_en, title_pl, heading_pl', 'length', 'max'=>200),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, title_en, heading_en, body_en, body_pl, title_pl, heading_pl', 'safe', 'on'=>'search'),
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
			'id' => 'ID',
			'title_en' => 'Title (English)',
			'title_pl' => 'Title (Polish)',
			'heading_en' => 'Heading (English)',
			'heading_pl' => 'Heading (Polish)',
			'body_en' => 'Body (English)',
			'body_pl' => 'Body (Polish)',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('title_en',$this->title_en,true);
		$criteria->compare('heading_en',$this->heading_en,true);
		$criteria->compare('body_en',$this->body_en,true);
		$criteria->compare('body_pl',$this->body_pl,true);
		$criteria->compare('title_pl',$this->title_pl,true);
		$criteria->compare('heading_pl',$this->heading_pl,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}