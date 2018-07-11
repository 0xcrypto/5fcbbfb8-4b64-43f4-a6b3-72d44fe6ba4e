import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html'
})
export class SoundComponent implements OnInit {
  audio_files:string[] = ["1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3", "6.mp3", "7.mp3"];
  currentAudioIndex = 0;
  player:any = null;
  isPlaying:boolean = false;
  isMute:boolean = false;
  
  constructor() { 

  }

  ngOnInit() {
    this.player = new Audio();
    this.play();
  }

  play(){
    this.player.src = "./assets/mp3/"+this.audio_files[this.currentAudioIndex];
    this.player.play();
    this.isPlaying = true;
  }

  pause(){
    this.player.pause();
    this.isPlaying = false;
  }

  playNext(){
    if(this.currentAudioIndex == this.audio_files.length - 1 )
      this.currentAudioIndex = 0;
    
      this.currentAudioIndex++;
      this.play();
  }

  playPrevious(){
    if(this.currentAudioIndex < 0)
      this.currentAudioIndex = this.audio_files.length - 1;
    
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
}
