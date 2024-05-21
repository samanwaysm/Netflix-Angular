import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { MovieService } from '../../shared/services/movie.service';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from '../../shared/models/video-content.interfase';
import { Observable, combineLatest, forkJoin, map } from 'rxjs';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, HeaderComponent,BannerComponent,MovieCarouselComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit {
  private loggedInUser = sessionStorage.getItem('loggedInUser');
  constructor(private router: Router){
    if(!this.loggedInUser){
      router.navigate(['/']);
    }else{
      this.name = JSON.parse((this.loggedInUser)!).name;
      this.userProfileImg = JSON.parse((this.loggedInUser)!).picture;
    }
  }

  auth = inject(AuthService);
  movieService = inject(MovieService)

  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name
  userProfileImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email

  bannerDetails = new Observable<any>();
  bannerVideo!: string;

  movies: IVideoContent[] = []
  tvShows: IVideoContent[] = []
  ratedMovies: IVideoContent[] = []
  nowPlayingMovies: IVideoContent[] = []
  popularMovies: IVideoContent[] = []
  topRatedMovies: IVideoContent[] = []
  upcomingMovies: IVideoContent[] = []

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getTopRated(),
  ]

  ngOnInit(): void {
    const joinData = combineLatest(this.sources);

    joinData.subscribe(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated]) => {
        this.bannerDetails = this.movieService.getBannerDetail(movies?.results[3].id);
        this.movieService.getBannerVideo(movies?.results[0].id).subscribe((resp: any) => {
          this.bannerVideo  = resp?.results[0].id;
        });
        this.movies = movies?.results as IVideoContent[];
        this.tvShows = tvShows?.results as IVideoContent[];
        this.nowPlayingMovies = nowPlaying?.results as IVideoContent[];
        this.upcomingMovies = upcoming?.results as IVideoContent[];
        this.popularMovies = popular?.results as IVideoContent[];
        this.topRatedMovies = topRated?.results as IVideoContent[];
      });
  }

  signOut(){
    sessionStorage.removeItem("loggedInUser")
    this.auth.signOut();
  }
}
