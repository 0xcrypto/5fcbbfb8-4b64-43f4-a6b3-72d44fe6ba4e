<?php
 
class Security extends CApplicationComponent
{
	function Encrypt($data) {
		$cryptKey = 'qJB0rGtIn5UB1xG03efyCp';
		$qEncoded = base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), $data, MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ) );
		return( $qEncoded );
	}

	function Decrypt($data) {
		$cryptKey = 'qJB0rGtIn5UB1xG03efyCp';
		$qDecoded = rtrim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), base64_decode( $data ), MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ), "\0");
		return( $qDecoded );
	}
}
?>