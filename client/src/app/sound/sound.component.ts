import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html'
})
export class SoundComponent implements OnInit {
  player_sounds:string[] = ["1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3", "6.mp3", "7.mp3"];
  bird_sound: string = "birds.mp3";
  open_gate_sound: string = "open-gate.mp3";
  close_gate_sound: string = "close-gate.mp3";
  open_crypt_sound: string = "open-crypt.mp3";
  close_crypt_sound: string = "close-crypt.mp3";
  currentAudioIndex = 0;
  player:any = null;
  gatePlayer: any = null;
  birdsPlayer: any = null;
  isPlaying:boolean = false;
  isMute:boolean = false;
  
  constructor(private messageService:MessageService) { 

  }

  ngOnInit() {
    this.player = new Audio();
    this.gatePlayer = new Audio();
    this.birdsPlayer = new Audio();
    //this.play();

    this.messageService.castMessage.subscribe(object => {
      let message = object.message;
      switch(message){
        case "PLAY_OPEN_GATE":
          this.playOpenGate();
          break;
        case "PLAY_CLOSE_GATE":
          this.playCloseGate();
          break;
        case "PLAY_OPEN_CRYPT":
          this.playOpenCrypt();
          break;
        case "PLAY_CLOSE_CRYPT":
          this.playCloseCrypt();
          break;
        case "PLAY_BIRDS":
          this.playBirds();
          break;
        case "STOP_BIRDS":
          this.stopBirds();
          break;
      }
    });
  }

  play(){
    this.player.src = "./assets/mp3/"+this.player_sounds[this.currentAudioIndex];
    this.player.play();
    this.isPlaying = true;
  }

  pause(){
    this.player.pause();
    this.isPlaying = false;
  }

  playNext(){
    if(this.currentAudioIndex == this.player_sounds.length - 1 )
      this.currentAudioIndex = 0;
    
      this.currentAudioIndex++;
      this.play();
  }

  playPrevious(){
    if(this.currentAudioIndex < 0)
      this.currentAudioIndex = this.player_sounds.length - 1;
    
      this.currentAudioIndex--;
      this.play();
  }

  mute(){
    this.isMute = true;
    this.player.muted = true;
  }
  
  unmute(){
    this.isMute = false;
    this.player.muted = false;
  }

  playOpenGate(){
    this.gatePlayer.src = "./assets/mp3/"+this.open_gate_sound;
    this.gatePlayer.play();
  }

  playCloseGate(){
    this.gatePlayer.src = "./assets/mp3/"+this.close_gate_sound;
    this.gatePlayer.play();
  }

  playOpenCrypt(){
    this.gatePlayer.src = "./assets/mp3/"+this.open_crypt_sound;
    this.gatePlayer.play();
  }

  playCloseCrypt(){
    this.gatePlayer.src = "./assets/mp3/"+this.close_crypt_sound;
    this.gatePlayer.play();
  }

  playBirds(){
    this.birdsPlayer.src = "./assets/mp3/"+this.bird_sound;
    this.birdsPlayer.loop = true;
    this.birdsPlayer.play();
  }

  stopBirds(){
    if(this.birdsPlayer && this.birdsPlayer.isPlaying)
      this.birdsPlayer.stop();
  }
}
